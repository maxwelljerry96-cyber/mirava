import { unstable_noStore as noStore } from 'next/cache';
import { fallbackProducts, bundles as fallbackBundles } from '@/lib/catalog';
import { supabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import type { Bundle, Product } from '@/types';

export async function getProducts(): Promise<Product[]> {
  noStore();
  if (!supabaseConfigured()) return fallbackProducts;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('featured', { ascending: false })
      .order('name');
    return error || !data?.length ? fallbackProducts : data as Product[];
  } catch {
    return fallbackProducts;
  }
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) || null;
}

export async function getBundles(): Promise<Bundle[]> {
  noStore();
  const fallback: Bundle[] = fallbackBundles.map((bundle) => ({
    id: bundle.id,
    external_key: bundle.id,
    slug: bundle.slug,
    name: bundle.name,
    description: bundle.description,
    price_minor: bundle.price_minor,
    currency: bundle.currency,
    image_url: bundle.image_url,
    active: true,
    stock: bundle.stock,
  }));
  if (!supabaseConfigured()) return fallback;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('bundles')
      .select('*')
      .eq('active', true)
      .order('created_at');
    return error || !data?.length ? fallback : data as Bundle[];
  } catch {
    return fallback;
  }
}
