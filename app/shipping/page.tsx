import Link from 'next/link';

export default function Page() {
  return (
    <article className="legal container">
      <span className="eyebrow">Order support</span>
      <h1>Shipping & Delivery</h1>
      <p className="legal-lead">FRUTÉO products are prepared for delivery only after payment has been confirmed and the order has entered fulfilment.</p>
      <h2>Delivery areas</h2>
      <p>Available cities, delivery windows and fees depend on the operating location configured by the business. The checkout page displays the delivery fee before payment.</p>
      <h2>Free delivery</h2>
      <p>Eligible orders of EGP 1,200 or more receive free delivery automatically. Discounts are applied before the free-delivery threshold is checked.</p>
      <h2>Processing</h2>
      <p>Paid orders move through the following stages: paid, processing, shipped and delivered. The business may contact you when an address, phone number or delivery instruction needs clarification.</p>
      <h2>Tracking</h2>
      <p>Use the order reference and checkout email on the tracking page. Signed-in customers can also open an order from their account history.</p>
      <h2>Chilled products</h2>
      <p>Fruit elixirs should be received promptly and refrigerated according to the label. Do not leave chilled deliveries unattended for long periods.</p>
      <h2>Incorrect address or missed delivery</h2>
      <p>Contact customer care as soon as possible. Additional delivery fees may apply when a delivery must be attempted again because the address or contact details were incorrect.</p>
      <div className="hero-actions"><Link className="button button-primary" href="/track">Track an order</Link><Link className="button button-secondary" href="/contact">Contact support</Link></div>
    </article>
  );
}
