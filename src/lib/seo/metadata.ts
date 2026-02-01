import { Metadata } from 'next';
import { getSchoolSettings } from '@/lib/branding/branding';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface SEOConfig {
    title: string;
    description: string;
    path?: string;
    locale?: 'bn' | 'en';
    image?: string;
    noindex?: boolean;
}

/**
 * Generate metadata for a page with i18n and branding support
 */
export async function generateSEOMetadata(config: SEOConfig): Promise<Metadata> {
    const settings = await getSchoolSettings();
    const {
        title,
        description,
        path = '',
        locale = 'bn',
        image,
        noindex = false,
    } = config;

    const schoolName: string = (locale === 'bn' ? settings?.schoolNameBn : settings?.schoolNameEn) ?? 'School Management System';
    const fullTitle = `${title} | ${schoolName}`;
    const url = `${APP_URL}${path}`;
    const alternateLocale = locale === 'bn' ? 'en' : 'bn';

    return {
        title: fullTitle,
        description,
        applicationName: schoolName,

        // Open Graph
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: schoolName,
            locale: locale === 'bn' ? 'bn_BD' : 'en_US',
            type: 'website',
            images: image ? [{ url: image }] : undefined,
        },

        // Twitter Card
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: image ? [image] : undefined,
        },

        // Alternate languages
        alternates: {
            canonical: url,
            languages: {
                'bn-BD': `${APP_URL}${path}?lang=bn`,
                'en-US': `${APP_URL}${path}?lang=en`,
            },
        },

        // Robots
        robots: noindex
            ? {
                index: false,
                follow: false,
            }
            : {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },

        // Verification (add later if needed)
        // verification: {
        //   google: 'google-site-verification-code',
        // },
    };
}

/**
 * Generate JSON-LD structured data for Organization
 */
export async function generateOrganizationSchema() {
    const settings = await getSchoolSettings();

    return {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: settings?.schoolNameBn ?? 'School',
        url: APP_URL,
        logo: settings?.logoUrl ?? undefined,
        // Add EIIN if available in settings
        identifier: settings?.eiin ?? undefined,
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'BD',
        },
    };
}

/**
 * Generate JSON-LD structured data for WebSite
 */
export async function generateWebSiteSchema() {
    const settings = await getSchoolSettings();

    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: settings?.schoolNameBn ?? 'School',
        url: APP_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${APP_URL}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}
