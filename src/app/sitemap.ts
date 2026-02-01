import { MetadataRoute } from 'next';
import { env } from '@/lib/env';

const APP_URL = env.NEXT_PUBLIC_APP_URL;

export default function sitemap(): MetadataRoute.Sitemap {
    const currentDate = new Date();

    return [
        {
            url: APP_URL,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1,
            alternates: {
                languages: {
                    bn: `${APP_URL}?lang=bn`,
                    en: `${APP_URL}?lang=en`,
                },
            },
        },
        {
            url: `${APP_URL}/about`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
            alternates: {
                languages: {
                    bn: `${APP_URL}/about?lang=bn`,
                    en: `${APP_URL}/about?lang=en`,
                },
            },
        },
        {
            url: `${APP_URL}/contact`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
            alternates: {
                languages: {
                    bn: `${APP_URL}/contact?lang=bn`,
                    en: `${APP_URL}/contact?lang=en`,
                },
            },
        },
        {
            url: `${APP_URL}/notices`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.9,
            alternates: {
                languages: {
                    bn: `${APP_URL}/notices?lang=bn`,
                    en: `${APP_URL}/notices?lang=en`,
                },
            },
        },
    ];
}
