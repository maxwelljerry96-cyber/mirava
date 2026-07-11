'use client';

import Image from 'next/image';
import { formatMoney } from '@/lib/catalog';
import { useCart } from '@/components/cart-provider';
import type { Bundle } from '@/types';

export function BundleGrid({ bundles }: { bundles: Bundle[] }) {
  const { addItem } = useCart();
  return (
    <div className="bundle-grid">
      {bundles.map((bundle) => (
        <article className="bundle-card" key={bundle.id}>
          <Image src={bundle.image_url} alt={bundle.name} width={1200} height={900} />
          <div>
            <span className="mini-tag">Curated value</span>
            <h3>{bundle.name}</h3>
            <p>{bundle.description}</p>
            <strong>{formatMoney(bundle.price_minor, bundle.currency)}</strong>
            <button
              className="button button-primary"
              disabled={!bundle.stock}
              onClick={() => addItem({
                id: bundle.external_key,
                slug: bundle.slug,
                name: bundle.name,
                price_minor: bundle.price_minor,
                currency: bundle.currency,
                image_url: bundle.image_url,
                quantity: 1,
                stock: bundle.stock,
              })}
            >
              {bundle.stock ? 'Add bundle' : 'Sold out'}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
