'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import { formatMoney } from '@/lib/catalog';

export function CartPageClient() {
  const { items, subtotalMinor, updateQuantity, removeItem } = useCart();
  const shipping = subtotalMinor >= 120000 ? 0 : 12000;
  return (
    <section className="page-shell container">
      <div className="page-title"><span className="eyebrow">Your fruit selection</span><h1>Shopping Cart</h1></div>
      {!items.length ? <div className="empty-state large"><h2>Your cart is empty.</h2><Link className="button button-primary" href="/products">Explore products</Link></div> : (
        <div className="cart-page-grid">
          <div className="cart-page-items">
            {items.map((item) => <article key={item.id}><Image src={item.image_url} alt={item.name} width={160} height={120}/><div><h3>{item.name}</h3><p>{formatMoney(item.price_minor, item.currency)} each</p><div className="quantity-control"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Reduce ${item.name}`}><Minus/></button><b>{item.quantity}</b><button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name}`}><Plus/></button></div></div><strong>{formatMoney(item.price_minor * item.quantity, item.currency)}</strong><button className="remove-button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}><Trash2/></button></article>)}
          </div>
          <aside className="order-summary"><h2>Order Summary</h2><div><span>Subtotal</span><b>{formatMoney(subtotalMinor)}</b></div><div><span>Shipping</span><b>{shipping ? formatMoney(shipping) : 'Free'}</b></div><div className="summary-total"><span>Total</span><b>{formatMoney(subtotalMinor + shipping)}</b></div><Link className="button button-primary button-block" href="/checkout">Continue to checkout</Link></aside>
        </div>
      )}
    </section>
  );
}
