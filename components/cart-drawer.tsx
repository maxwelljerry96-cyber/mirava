'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import { formatMoney } from '@/lib/catalog';

export function CartDrawer() {
  const { items, subtotalMinor, open, setOpen, updateQuantity, removeItem } = useCart();
  return (
    <div className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
      <button className="cart-backdrop" onClick={() => setOpen(false)} aria-label="Close cart" />
      <aside className="cart-panel">
        <div className="cart-head"><h3>Shopping Cart</h3><button className="icon-button" onClick={() => setOpen(false)} aria-label="Close cart"><X /></button></div>
        <div className="cart-items">
          {!items.length && <div className="empty-state"><h4>Your cart is empty.</h4><Link className="button button-primary" href="/products" onClick={() => setOpen(false)}>Explore products</Link></div>}
          {items.map((item) => (
            <article className="cart-line" key={item.id}>
              <Image src={item.image_url} alt={item.name} width={84} height={70} />
              <div><strong>{item.name}</strong><small>{formatMoney(item.price_minor, item.currency)}</small><div className="quantity-control"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Reduce ${item.name}`}><Minus /></button><b>{item.quantity}</b><button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name}`}><Plus /></button></div></div>
              <button className="remove-button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}><Trash2 /></button>
            </article>
          ))}
        </div>
        <div className="cart-foot"><div className="cart-total-row"><span>Subtotal</span><strong>{formatMoney(subtotalMinor)}</strong></div><Link href="/checkout" className={`button button-primary button-block ${!items.length ? 'disabled' : ''}`} onClick={() => setOpen(false)}>Proceed to checkout</Link><Link href="/cart" className="text-link" onClick={() => setOpen(false)}>View full cart</Link></div>
      </aside>
    </div>
  );
}
