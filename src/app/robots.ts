import { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
    const APP_URL = env.NEXT_PUBLIC_APP_URL;

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin',
                    '/admin/*',
                    '/teacher',
                    '/teacher/*',
                    '/student',
                    '/student/*',
                    '/guardian',
                    '/guardian/*',
                    '/api',
                    '/api/*',
                    '/login',
                    '/logout',
                ],
            },
        ],
        sitemap: `${APP_URL}/sitemap.xml`,
    };
}
