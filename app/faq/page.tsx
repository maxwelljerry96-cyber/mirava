import Link from 'next/link';

const groups = [
  {
    title: 'Products & Ingredients',
    items: [
      ['What is FRUTÉO?', 'FRUTÉO is a fruit-led elixir brand built around bright flavour, clear ingredient lists and convenient chilled bottles.'],
      ['Where can I see the ingredients?', 'Every product page includes its current ingredient list and key product notes.'],
      ['How should the bottles be stored?', 'Keep bottles chilled. After opening, close the cap properly and consume promptly according to the label.'],
      ['Do you provide allergen information?', 'Product-specific allergen and handling details should be checked on the product label and product page before purchase.'],
    ],
  },
  {
    title: 'Orders & Payment',
    items: [
      ['How do I know my payment was successful?', 'A paid order receives a confirmation page and an order email after the payment provider confirms the transaction.'],
      ['Can prices change after I add an item to my cart?', 'The server checks the latest price and stock before payment begins. Your order summary shows the final amount before you continue.'],
      ['Can I use a discount code?', 'Enter an active code during checkout. The server checks the code, expiry date and minimum order before applying it.'],
      ['Can I order without an account?', 'Yes. Guest checkout is supported. Creating an account also gives you an order history.'],
    ],
  },
  {
    title: 'Delivery, Tracking & Support',
    items: [
      ['How do I track my order?', 'Use the Track Order page with your reference and checkout email. Signed-in customers can also view order history from their account.'],
      ['When is free delivery applied?', 'Free delivery is automatically applied when the eligible order total reaches EGP 1,200.'],
      ['How do I change a delivery address?', 'Contact customer care immediately. An address can only be changed before fulfilment begins.'],
      ['How do I contact the team?', 'Use the contact form or email hello@fruteo.com. Your message is saved for the support team and can also be sent to the business inbox.'],
    ],
  },
];

export default function Page() {
  return (
    <section className="page-shell container">
      <div className="page-title"><span className="eyebrow">Help centre</span><h1>Frequently Asked Questions</h1><p>Clear answers about products, payment, delivery and support.</p></div>
      <div className="faq-page-grid">
        {groups.map((group) => (
          <section className="faq-group" key={group.title}>
            <h2>{group.title}</h2>
            {group.items.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
          </section>
        ))}
      </div>
      <div className="support-callout"><h2>Still need help?</h2><p>Send a message and include your order reference when the question is about an existing order.</p><Link className="button button-primary" href="/contact">Contact customer care</Link></div>
    </section>
  );
}
