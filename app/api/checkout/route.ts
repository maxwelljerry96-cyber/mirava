import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminConfigured, appUrl } from '@/lib/env';
import { createAdminClient } from '@/lib/supabase/admin';
import { initializePayment } from '@/lib/paystack';
import { getCurrentUser } from '@/lib/auth';

type CheckoutRecord = {
  id: string;
  lookupKey: string;
  type: 'product' | 'bundle';
  name: string;
  slug: string;
  image_url: string;
  price_minor: number;
  stock: number;
};

const schema = z.object({
  fullName: z.string().min(2),
  email: z.email(),
  phone: z.string().min(6),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional().default(''),
  city: z.string().min(2),
  country: z.string().min(2),
  postalCode: z.string().optional().default(''),
  couponCode: z.string().optional().default(''),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1).max(24) })).min(1),
});

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i;

export async function POST(request: Request) {
  try {
    if (!adminConfigured()) return NextResponse.json({ error: 'The live database is not connected.' }, { status: 503 });
    if (!process.env.PAYSTACK_SECRET_KEY) return NextResponse.json({ error: 'Paystack is not connected.' }, { status: 503 });

    const input = schema.parse(await request.json());
    const supabase = createAdminClient();
    const productIds = input.items.map((item) => item.productId).filter((id) => uuidPattern.test(id));
    const bundleKeys = input.items.map((item) => item.productId).filter((id) => !uuidPattern.test(id));

    const [{ data: dbProducts }, { data: dbBundles }] = await Promise.all([
      productIds.length
        ? supabase.from('products').select('*').in('id', productIds).eq('active', true)
        : Promise.resolve({ data: [] }),
      bundleKeys.length
        ? supabase.from('bundles').select('*').in('external_key', bundleKeys).eq('active', true)
        : Promise.resolve({ data: [] }),
    ]);

    const records = new Map<string, CheckoutRecord>();
    dbProducts?.forEach((product) => records.set(product.id, {
      id: product.id,
      lookupKey: product.id,
      type: 'product',
      name: product.name,
      slug: product.slug,
      image_url: product.image_url,
      price_minor: product.price_minor,
      stock: product.stock,
    }));
    dbBundles?.forEach((bundle) => records.set(bundle.external_key, {
      id: bundle.id,
      lookupKey: bundle.external_key,
      type: 'bundle',
      name: bundle.name,
      slug: bundle.slug,
      image_url: bundle.image_url,
      price_minor: bundle.price_minor,
      stock: bundle.stock,
    }));

    const lines = input.items.map((item) => {
      const record = records.get(item.productId);
      if (!record) throw new Error('A selected item is no longer available. Refresh the store and try again.');
      if (record.stock < item.quantity) throw new Error(`${record.name} has insufficient stock.`);
      return { record, quantity: item.quantity, total: record.price_minor * item.quantity };
    });

    const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
    let discount = 0;
    let couponId: string | null = null;

    if (input.couponCode.trim()) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .ilike('code', input.couponCode.trim())
        .eq('active', true)
        .maybeSingle();
      if (!coupon) throw new Error('Invalid coupon code.');
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) throw new Error('Coupon expired.');
      if (subtotal < coupon.minimum_order_minor) throw new Error('Coupon minimum not reached.');
      discount = coupon.type === 'percent' ? Math.round(subtotal * coupon.value / 100) : Math.min(coupon.value, subtotal);
      couponId = coupon.id;
    }

    const shipping = subtotal - discount >= 120000 ? 0 : 12000;
    const total = subtotal - discount + shipping;
    const currency = process.env.PAYSTACK_CURRENCY || 'EGP';
    const reference = `FRU-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const user = await getCurrentUser();

    const { data: order, error: orderError } = await supabase.from('orders').insert({
      reference,
      user_id: user?.id || null,
      email: input.email.toLowerCase(),
      full_name: input.fullName,
      phone: input.phone,
      address_line_1: input.addressLine1,
      address_line_2: input.addressLine2,
      city: input.city,
      country: input.country,
      postal_code: input.postalCode,
      status: 'pending_payment',
      payment_status: 'pending',
      subtotal_minor: subtotal,
      discount_minor: discount,
      shipping_minor: shipping,
      total_minor: total,
      currency,
      coupon_id: couponId,
    }).select('id').single();

    if (orderError || !order) throw orderError || new Error('Order creation failed.');

    const { error: itemError } = await supabase.from('order_items').insert(lines.map(({ record, quantity }) => ({
      order_id: order.id,
      product_id: record.type === 'product' ? record.id : null,
      bundle_id: record.type === 'bundle' ? record.id : null,
      external_product_key: record.type === 'bundle' ? record.lookupKey : null,
      name: record.name,
      slug: record.slug,
      image_url: record.image_url,
      quantity,
      unit_price_minor: record.price_minor,
    })));
    if (itemError) throw itemError;

    const payment = await initializePayment({
      email: input.email,
      amount: total,
      reference,
      currency,
      callbackUrl: `${appUrl()}/checkout/success`,
      metadata: { order_id: order.id, order_reference: reference, cancel_action: `${appUrl()}/checkout` },
    });

    await supabase.from('orders').update({ paystack_access_code: payment.access_code }).eq('id', order.id);
    return NextResponse.json({ authorizationUrl: payment.authorization_url, reference });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Checkout failed.' }, { status: 400 });
  }
}
