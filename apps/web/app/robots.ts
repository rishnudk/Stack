import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/messages', '/api/', '/article/new'],
      },
    ],
    sitemap: 'https://stackkk.vercel.app/sitemap.xml',
  };
}
