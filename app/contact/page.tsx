import Image from 'next/image';
import { Hero } from '@/components/hero';
import { ContactForm } from '@/components/contact-form';

export default function Page() {
  return (
    <>
      <Hero title="We’d Love to" accent="Hear From You." copy="Questions, wholesale enquiries, press requests or a simple hello — send it our way." image="/assets/hero-citrus.webp" />
      <section className="section soft">
        <div className="container contact-grid">
          <article><h3>Customer Care</h3><p>Questions about products, delivery or an existing order.</p><a href="mailto:hello@fruteo.com">hello@fruteo.com</a><a href="tel:+18001234567">+1 800 123 4567</a></article>
          <article><h3>Wholesale</h3><p>Bring FRUTÉO into your shop, café, studio or hospitality space.</p><a href="mailto:wholesale@fruteo.com">wholesale@fruteo.com</a></article>
          <article><h3>Press & Media</h3><p>Features, interviews, collaborations and product requests.</p><a href="mailto:press@fruteo.com">press@fruteo.com</a></article>
        </div>
      </section>
      <section className="section">
        <div className="container contact-layout">
          <ContactForm />
          <article className="studio-card"><div><span className="eyebrow">Come say hello</span><h2>Our Studio</h2><p>FRUTÉO Studio, Santa Monica, CA</p><p>Monday–Friday, 9:00 AM–6:00 PM</p></div><Image src="/assets/contact-studio.webp" alt="FRUTÉO studio" width={800} height={1200} /></article>
        </div>
      </section>
      <section className="section soft"><div className="container map-card"><Image src="/assets/contact-map.webp" alt="Map showing the FRUTÉO studio location" width={1920} height={600} /></div></section>
      <section className="section" id="faq">
        <div className="container faq-grid">
          <details><summary>How do I track an order?</summary><p>Open the tracking page and enter your order reference together with the email used at checkout.</p></details>
          <details><summary>When is stock reserved?</summary><p>Stock is reduced only after the payment provider confirms a successful payment.</p></details>
          <details><summary>How will I receive updates?</summary><p>Order confirmation is sent by email, and the status can be checked from your account or the tracking page.</p></details>
          <details><summary>Can I ask about wholesale orders?</summary><p>Yes. Use the contact form or email wholesale@fruteo.com and our team will follow up.</p></details>
        </div>
      </section>
    </>
  );
}
