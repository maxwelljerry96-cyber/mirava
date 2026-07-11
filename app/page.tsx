import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/hero';
import { ProductGrid } from '@/components/product-grid';
import { NewsletterForm } from '@/components/newsletter-form';
import { getProducts } from '@/lib/products';

const ingredients = [
  ['Mango', '/assets/ingredient-mango.webp', 'Full, sunny sweetness and rich tropical colour.'],
  ['Passionfruit', '/assets/ingredient-passionfruit.webp', 'A bright, tangy finish that keeps every sip lively.'],
  ['Ginger', '/assets/ingredient-ginger.webp', 'Warm spice that gives the blend a clean, confident edge.'],
  ['Turmeric', '/assets/ingredient-turmeric.webp', 'A golden root with deep colour and an earthy finish.'],
];

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      <Hero
        title="Pure Fruit."
        accent="Pure Energy."
        copy="Cold-pressed fruit elixirs made with bold flavour, clean ingredients and a bright sense of style."
      />

      <section className="section soft">
        <div className="container">
          <div className="heading center">
            <span className="eyebrow">Goodness from nature</span>
            <h2>Powered by Real Ingredients</h2>
            <p>Mango, citrus, roots and bright botanicals bring every blend to life.</p>
          </div>
          <div className="ingredient-grid">
            {ingredients.map(([name, image, copy]) => (
              <article key={name}>
                <Image src={image} alt={name} width={420} height={420} />
                <h3>{name}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">Our story</span>
            <h2>Rooted in Nature. Made for You.</h2>
            <p>
              FRUTÉO began with a simple belief: fruit drinks can feel joyful, premium and honest at the same time.
              We keep the flavours recognisable, the ingredient lists clear and the whole experience beautifully fresh.
            </p>
            <Link href="/story" className="button button-secondary">Read our story</Link>
          </div>
          <Image src="/assets/story-splash-4k.webp" alt="FRUTÉO fruit scene" width={1920} height={1080} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="heading">
            <div>
              <span className="eyebrow">Our elixirs</span>
              <h2>Explore Our Collection</h2>
              <p>Four distinct blends, each with its own fruit personality.</p>
            </div>
            <Link href="/products" className="button button-secondary">View all products</Link>
          </div>
          <ProductGrid products={products.slice(0, 4)} filters={false} />
        </div>
      </section>

      <section className="section soft">
        <div className="container feature-grid">
          <article><h3>Real Fruit First</h3><p>Bold, recognisable fruit flavour is always the main event.</p></article>
          <article><h3>Clean, Bright Blends</h3><p>Thoughtful recipes without a heavy or artificial finish.</p></article>
          <article><h3>Made for Real Days</h3><p>Easy bottles for mornings, work breaks, meals and slow evenings.</p></article>
          <article><h3>Fresh by Design</h3><p>A colourful brand world inspired by orchards, leaves and juice splashes.</p></article>
        </div>
      </section>

      <section className="section">
        <div className="container newsletter-panel">
          <div>
            <span className="eyebrow">Stay fresh</span>
            <h2>Get first access to new blends.</h2>
            <p>Join the list for product drops, fresh offers and fruit-filled updates.</p>
            <NewsletterForm />
          </div>
          <Image src="/assets/newsletter-fruit-4k.webp" alt="Fruit splash" width={1920} height={720} />
        </div>
      </section>
    </>
  );
}
