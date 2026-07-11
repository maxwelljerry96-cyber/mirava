import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/hero';
import { ProductGrid } from '@/components/product-grid';
import { BundleGrid } from '@/components/bundle-grid';
import { getBundles, getProducts } from '@/lib/products';

export default async function Page() {
  const [products, bundles] = await Promise.all([getProducts(), getBundles()]);
  return (
    <>
      <Hero
        title="Shop Pure Energy."
        accent="Delivered Fresh."
        copy="Choose individual bottles, build a mixed cart or save with a curated fruit bundle."
        image="/assets/hero-citrus.webp"
      />
      <section className="section soft">
        <div className="container feature-grid">
          <article><h3>Free Delivery</h3><p>Automatically applied when your order reaches EGP 1,200.</p></article>
          <article><h3>Protected Checkout</h3><p>Your payment is confirmed securely before an order is marked as paid.</p></article>
          <article><h3>Easy Order Tracking</h3><p>Follow your order using its reference and the email used at checkout.</p></article>
          <article><h3>Fresh Stock</h3><p>Availability is kept current, so you only order what is ready to go.</p></article>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="heading"><h2>Shop All Products</h2></div>
          <ProductGrid products={products} />
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="heading"><div><span className="eyebrow">Better together</span><h2>Bundle & Save</h2></div></div>
          <BundleGrid bundles={bundles} />
        </div>
      </section>
      <section className="section">
        <div className="container shop-tools">
          <article>
            <Image src="/assets/bundle-citrus-boost.webp" alt="Fruit bundle" width={1200} height={900} />
            <div><span className="eyebrow">Fill the fridge</span><h2>Stock Up and Save on Delivery</h2><p>Add your favourite bottles until free delivery is applied automatically.</p><Link href="/products" className="button button-primary">Choose bottles</Link></div>
          </article>
          <article>
            <Image src="/assets/mixed-pack.webp" alt="Mixed pack" width={1200} height={900} />
            <div><span className="eyebrow">Your mix, your way</span><h2>Build Your Mixed Pack</h2><p>Combine tropical, berry, citrus and botanical flavours in one cart.</p><Link href="/products" className="button button-secondary">Build your pack</Link></div>
          </article>
        </div>
      </section>
    </>
  );
}
