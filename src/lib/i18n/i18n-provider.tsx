'use client'

import React, { createContext, useContext, useState, useEffect, useTransition } from 'react'
import { en, bn } from '@/lib/i18n'
import { updateLanguagePreference } from '@/lib/actions/profile-actions'

type Locale = 'en' | 'bn'

const I18nContext = createContext<{
    locale: Locale
    setLocale: (l: Locale) => void
    t: (key: string) => string
    isPending: boolean
}>({
    locale: 'bn',
    setLocale: () => { },
    t: (key) => key,
    isPending: false
})

export function I18nProvider({ children, initialLocale = 'bn' }: { children: React.ReactNode, initialLocale?: Locale }) {
    const [locale, setLocaleInternal] = useState<Locale>(initialLocale)
    const [isPending, startTransition] = useTransition()

    const setLocale = (newLocale: Locale) => {
        setLocaleInternal(newLocale)
        startTransition(async () => {
            await updateLanguagePreference(newLocale)
        })
    }

    const t = (path: string) => {
        const keys = path.split('.')
        let current: any = locale === 'bn' ? bn : en

        for (const k of keys) {
            if (!current || current[k] === undefined) {
                // Fallback to English if missing in Bangla
                if (locale === 'bn') {
                    let fb: any = en
                    for (const fk of keys) {
                        if (!fb || fb[fk] === undefined) return path
                        fb = fb[fk]
                    }
                    return fb
                }
                return path
            }
            current = current[k]
        }
        return current as string
    }

    return (
        <I18nContext.Provider value={{ locale, setLocale, t, isPending }}>
            {children}
        </I18nContext.Provider>
    )
}

export const useTranslation = () => useContext(I18nContext)
