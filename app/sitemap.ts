import type { MetadataRoute } from 'next';
import { appUrl } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = appUrl().replace(/\/$/, '');
  return ['', '/products', '/story', '/ingredients', '/benefits', '/shop', '/contact', '/track', '/faq', '/shipping', '/returns', '/privacy', '/terms'].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/products' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));
}
