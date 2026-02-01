'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/ui/LanguageToggle"
import { useTranslation } from "@/lib/i18n/i18n-provider"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/ui/cn"
import { GraduationCap } from "lucide-react"

export function PublicHeader({ settings }: { settings: any }) {
    const { t, locale } = useTranslation()
    const { data: session } = useSession()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                        {settings?.logoUrl ? (
                            <img src={settings.logoUrl} alt="Logo" className="h-7 w-7 object-contain" />
                        ) : (
                            <GraduationCap className="h-6 w-6" />
                        )}
                    </div>
                    <span className="hidden font-bold text-slate-900 sm:inline-block">
                        {locale === 'bn' ? settings?.schoolNameBn : settings?.schoolNameEn}
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 px-6 py-2 rounded-full bg-slate-50/50 border border-slate-100 italic transition-all">
                    <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                        {t('about')}
                    </Link>
                    <Link href="/notices" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                        {t('notices')}
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                        {t('contact')}
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <LanguageToggle />
                    {session ? (
                        <div className="flex items-center gap-4">
                            <span className="hidden text-sm font-medium text-slate-600 lg:block">
                                {session.user?.name}
                            </span>
                            <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                                <Link href="/admin">Dashboard</Link>
                            </Button>
                            <Button onClick={() => signOut()} variant="outline" size="sm">
                                {t('auth.logout')}
                            </Button>
                        </div>
                    ) : (
                        <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800">
                            <Link href="/login">{t('auth.login')}</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
