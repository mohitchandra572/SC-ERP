import { locales } from './index';
import { cookies } from 'next/headers';

export type Locale = 'en' | 'bn';

export async function getServerTranslation() {
    const cookieStore = await cookies();
    const locale = (cookieStore.get('NEXT_LOCALE')?.value || 'bn') as Locale;
    const dictionary = locales[locale];

    const t = (path: string, variables?: Record<string, string | number>) => {
        const keys = path.split('.');
        let current: any = dictionary;

        for (const k of keys) {
            if (current[k] === undefined) {
                // Fallback to English
                if (locale === 'bn') {
                    let fb: any = locales.en;
                    for (const fk of keys) {
                        if (fb[fk] === undefined) return path;
                        fb = fb[fk];
                    }
                    current = fb;
                    break;
                }
                return path;
            }
            current = current[k];
        }

        let result = current as string;
        if (variables) {
            Object.entries(variables).forEach(([key, value]) => {
                result = result.replace(`{${key}}`, String(value));
            });
        }
        return result;
    };

    return { t, locale };
}
