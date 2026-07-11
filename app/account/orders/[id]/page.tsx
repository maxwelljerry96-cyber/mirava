import Image from 'next/image';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatMoney } from '@/lib/catalog';

type OrderItem = { id: string; name: string; image_url: string; quantity: number; unit_price_minor: number };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase.from('orders').select('*,order_items(*)').eq('id', id).eq('user_id', user.id).maybeSingle();
  if (!order) notFound();
  const items = order.order_items as OrderItem[];
  return <section className="page-shell container"><div className="page-title"><h1>{order.reference}</h1><p>Status: {order.status}</p></div><div className="account-grid"><section className="account-card">{items.map((item) => <article className="order-item" key={item.id}><Image src={item.image_url} alt={item.name} width={100} height={80}/><span><b>{item.name}</b><small>Quantity {item.quantity}</small></span><b>{formatMoney(item.unit_price_minor * item.quantity, order.currency)}</b></article>)}</section><aside className="account-card"><h2>Summary</h2><p>Payment: {order.payment_status}</p><p>Total: {formatMoney(order.total_minor, order.currency)}</p><p>{order.address_line_1}, {order.city}, {order.country}</p></aside></div></section>;
}
