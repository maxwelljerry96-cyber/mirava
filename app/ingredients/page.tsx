import Image from 'next/image';
import { Hero } from '@/components/hero';

const data = [
  ['Mango', '/assets/ingredient-mango.webp', 'Ripe tropical sweetness, a full mouthfeel and unmistakable golden colour.'],
  ['Passionfruit', '/assets/ingredient-passionfruit.webp', 'Tangy, aromatic fruit that keeps richer blends lively and balanced.'],
  ['Ginger', '/assets/ingredient-ginger.webp', 'Warm spice and a clean finish that gives fruit blends more depth.'],
  ['Turmeric', '/assets/ingredient-turmeric.webp', 'Earthy golden character used in our warmer, wellness-led recipes.'],
];

export default function Page() {
  return (
    <>
      <Hero title="Every Bottle Begins" accent="with Real Ingredients." copy="Fruit stays at the centre, supported by carefully chosen roots and botanicals." image="/assets/hero-citrus.webp" />
      <section className="section soft">
        <div className="container">
          <div className="heading center"><span className="eyebrow">Our ingredients</span><h2>Simple Ingredients. Bright Purpose.</h2><p>Each ingredient earns its place through flavour, aroma, colour or balance.</p></div>
          <div className="ingredient-grid">
            {data.map(([name, image, copy]) => (
              <article key={name}><Image src={image} alt={name} width={420} height={420} /><h3>{name}</h3><p>{copy}</p><div className="tag-row"><span>Plant based</span><span>Fruit forward</span></div></article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container feature-grid">
          <article><h3>No Unnecessary Extras</h3><p>We keep each recipe focused, readable and easy to understand.</p></article>
          <article><h3>Cold-Pressed Character</h3><p>A gentle process helps the fruit keep its bright flavour and personality.</p></article>
          <article><h3>Clear Ingredient Lists</h3><p>Every product page shows exactly what is inside the bottle.</p></article>
          <article><h3>Fruit-Led Flavour</h3><p>Roots and botanicals support the fruit rather than covering it.</p></article>
        </div>
      </section>
    </>
  );
}
