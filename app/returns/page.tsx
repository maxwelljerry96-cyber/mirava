import Link from 'next/link';

export default function Page() {
  return (
    <article className="legal container">
      <span className="eyebrow">Order support</span>
      <h1>Returns & Refunds</h1>
      <p className="legal-lead">Because fruit drinks are perishable food products, ordinary change-of-mind returns are not accepted after delivery. Problems with an order are handled quickly and fairly.</p>
      <h2>Damaged, incorrect or missing items</h2>
      <p>Contact customer care as soon as possible after delivery. Include the order reference, a clear explanation and photographs when an item arrived damaged or incorrect.</p>
      <h2>Quality concerns</h2>
      <p>Do not consume a product that appears unsafe, unsealed or incorrectly stored. Keep the bottle, packaging and batch information while the team reviews the issue.</p>
      <h2>Refund assessment</h2>
      <p>Approved refunds may cover the affected item, the full order or another reasonable resolution. The decision depends on the evidence, delivery record and nature of the issue.</p>
      <h2>Payment refunds</h2>
      <p>Approved refunds are returned through the original payment method where possible. Bank and payment-provider processing times may affect when the funds appear.</p>
      <h2>Cancelled orders</h2>
      <p>Cancellation requests must be made before fulfilment begins. Once a chilled order has been prepared or dispatched, cancellation may no longer be possible.</p>
      <div className="hero-actions"><Link className="button button-primary" href="/contact">Report an order issue</Link><Link className="button button-secondary" href="/track">Check order status</Link></div>
    </article>
  );
}
