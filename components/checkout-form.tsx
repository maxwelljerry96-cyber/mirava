'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/components/cart-provider';
import { formatMoney } from '@/lib/catalog';

export function CheckoutForm() {
  const { items, subtotalMinor } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const shipping = subtotalMinor >= 120000 ? 0 : 12000;

  async function action(formData: FormData) {
    setLoading(true);
    setError('');
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...Object.fromEntries(formData.entries()),
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
      }),
    });
    const data = await response.json();
    if (response.ok) window.location.href = data.authorizationUrl;
    else {
      setError(data.error);
      setLoading(false);
    }
  }

  if (!items.length) return <div className="empty-state large"><h2>Your cart is empty.</h2><Link className="button button-primary" href="/products">Explore products</Link></div>;

  return (
    <form className="checkout-grid" action={action}>
      <section className="form-card"><span className="eyebrow">Delivery information</span><h2>Where should we send it?</h2><div className="field-grid"><label>Full name<input name="fullName" required/></label><label>Email<input type="email" name="email" required/></label><label>Phone<input name="phone" required/></label><label>City<input name="city" required/></label></div><label>Address line 1<input name="addressLine1" required/></label><label>Address line 2<input name="addressLine2"/></label><div className="field-grid"><label>Country<input name="country" defaultValue="Egypt" required/></label><label>Postal code<input name="postalCode"/></label></div><label>Coupon code<input name="couponCode" placeholder="Optional"/></label></section>
      <aside className="order-summary"><h2>Your Order</h2>{items.map((item) => <div className="checkout-line" key={item.id}><Image src={item.image_url} alt={item.name} width={60} height={48}/><span>{item.name}<small>Quantity {item.quantity}</small></span><b>{formatMoney(item.price_minor * item.quantity, item.currency)}</b></div>)}<div><span>Subtotal</span><b>{formatMoney(subtotalMinor)}</b></div><div><span>Shipping</span><b>{shipping ? formatMoney(shipping) : 'Free'}</b></div><div className="summary-total"><span>Estimated total</span><b>{formatMoney(subtotalMinor + shipping)}</b></div><button className="button button-primary button-block" disabled={loading}>{loading ? 'Opening secure payment…' : 'Pay securely with Paystack'}</button>{error && <p className="form-error">{error}</p>}<p className="fine-print">Prices, stock, discounts, amount and currency are checked again by the server before payment opens.</p></aside>
    </form>
  );
}
