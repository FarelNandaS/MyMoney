import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Ubah domain ini sesuai domain produksi kamu
  const baseUrl = 'https://mymoney.vercel.app'; 

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/add', '/history', '/offline', '/settings'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}