'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/cart-provider';

type VerificationState = 'loading' | 'success' | 'failed';

export function CheckoutSuccess({ reference }: { reference?: string }) {
  const [state, setState] = useState<VerificationState>(reference ? 'loading' : 'failed');
  const [message, setMessage] = useState(reference ? 'Confirming payment with Paystack…' : 'No payment reference was provided.');
  const { clear } = useCart();

  useEffect(() => {
    if (!reference) return;
    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then(async (response) => ({ ok: response.ok, data: await response.json() }))
      .then(({ ok, data }) => {
        if (ok && data.paid) {
          setState('success');
          setMessage('Payment confirmed. Your order is now being prepared.');
          clear();
        } else {
          setState('failed');
          setMessage(data.error || 'Payment was not confirmed.');
        }
      })
      .catch(() => {
        setState('failed');
        setMessage('Payment verification could not be completed.');
      });
  }, [reference, clear]);

  return <div className={`payment-result ${state}`}><span className="eyebrow">Order status</span><h1>{state === 'success' ? 'Thank You. It’s Confirmed.' : state === 'failed' ? 'Payment Not Confirmed' : 'Checking Your Payment'}</h1><p>{message}</p>{reference && <b>Reference: {reference}</b>}<div className="hero-actions"><Link className="button button-primary" href="/account">View account</Link><Link className="button button-secondary" href="/track">Track order</Link></div></div>;
}
