'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { Product } from '@/types';

export function SearchDialog({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const list = useMemo(() => products.filter((product) => [product.name, product.category, ...product.ingredients].join(' ').toLowerCase().includes(query.toLowerCase())).slice(0, 6), [products, query]);
  return <><button className="icon-button" onClick={() => setOpen(true)} aria-label="Search"><Search/></button>{open && <div className="search-overlay"><button className="search-backdrop" onClick={() => setOpen(false)} aria-label="Close search"/><div className="search-panel"><div className="search-head"><div><span className="eyebrow">Find your flavour</span><h2>Search FRUTÉO</h2></div><button className="icon-button" onClick={() => setOpen(false)} aria-label="Close search"><X/></button></div><label className="search-field"><Search/><input autoFocus placeholder="Try mango, berry or citrus" value={query} onChange={(event) => setQuery(event.target.value)}/></label><div className="search-results">{list.map((product) => <Link href={`/products/${product.slug}`} key={product.id} onClick={() => setOpen(false)}><Image src={product.image_url} alt={product.name} width={85} height={65}/><span><strong>{product.name}</strong><small>{product.category}</small></span></Link>)}</div></div></div>}</>;
}
