'use client'

import { GraduationCap, Mail, Phone, MapPin } from "lucide-react"
import { useTranslation } from "@/lib/i18n/i18n-provider"

export function PublicFooter({ settings }: { settings: any }) {
    const { t, locale } = useTranslation()

    return (
        <footer className="w-full border-t bg-slate-50 py-12">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-slate-900">
                                {locale === 'bn' ? settings?.schoolNameBn : settings?.schoolNameEn}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            {locale === 'bn' ? settings?.footerTextBn : settings?.footerTextEn}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-slate-900">{t('nav.footer.links')}</h4>
                        <nav className="flex flex-col gap-2">
                            <a href="/about" className="text-sm text-slate-500 hover:text-primary transition-colors">{t('about')}</a>
                            <a href="/notices" className="text-sm text-slate-500 hover:text-primary transition-colors">{t('notices')}</a>
                            <a href="/contact" className="text-sm text-slate-500 hover:text-primary transition-colors">{t('contact')}</a>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-slate-900">{t('contact')}</h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>{settings?.phone || '-'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>{settings?.email || '-'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{locale === 'bn' ? settings?.addressBn : settings?.addressEn}</span>
                            </div>
                        </div>
                    </div>

                    {/* EIIN Section */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-slate-900">EIIN</h4>
                        <div className="rounded-lg bg-white p-4 border border-slate-200">
                            <span className="text-2xl font-bold tracking-wider text-slate-900">
                                {settings?.eiin || '000000'}
                            </span>
                            <p className="mt-1 text-xs text-slate-400 uppercase font-medium">Verified Institution</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t pt-8 text-center text-xs text-slate-400">
                    <p>© {new Date().getFullYear()} {locale === 'bn' ? settings?.schoolNameBn : settings?.schoolNameEn}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
