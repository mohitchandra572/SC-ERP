'use client'

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/i18n-provider"

export function LanguageToggle() {
    const { locale, setLocale } = useTranslation()

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocale(locale === 'bn' ? 'en' : 'bn')}
        >
            {locale === 'bn' ? 'English' : 'বাংলা'}
        </Button>
    )
}






