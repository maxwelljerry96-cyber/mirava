'use client';

import { useState } from 'react';
import { formatMoney } from '@/lib/catalog';

type TrackedOrder = { reference: string; status: string; payment_status: string; total_minor: number; currency: string; created_at: string };

export function TrackForm() {
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState('');
  async function action(formData: FormData) {
    setError('');
    const response = await fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
    const data = await response.json();
    if (response.ok) setOrder(data.order as TrackedOrder);
    else setError(data.error);
  }
  return <div className="track-layout"><form className="form-card" action={action}><h2>Enter Order Details</h2><label>Order reference<input name="reference" required/></label><label>Checkout email<input type="email" name="email" required/></label><button className="button button-primary">Track order</button>{error && <p className="form-error">{error}</p>}</form><article className="tracking-result">{order ? <><span className="eyebrow">Order found</span><h2>{order.reference}</h2><dl><div><dt>Status</dt><dd>{order.status.replaceAll('_', ' ')}</dd></div><div><dt>Payment</dt><dd>{order.payment_status}</dd></div><div><dt>Total</dt><dd>{formatMoney(order.total_minor, order.currency)}</dd></div></dl></> : <><h2>Track every step.</h2><p>Your order moves from paid to processing, shipped and delivered.</p></>}</article></div>;
}
