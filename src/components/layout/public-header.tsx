'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/ui/LanguageToggle"
import { useTranslation } from "@/lib/i18n/i18n-provider"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/ui/cn"
import { GraduationCap } from "lucide-react"

import { Phone, Mail, User, LogIn } from "lucide-react"
import { usePathname } from "next/navigation"

export function PublicHeader({ settings }: { settings: any }) {
    const { t, locale } = useTranslation()
    const { data: session } = useSession()
    const pathname = usePathname()

    const navLinks = [
        { href: "/", label: t('nav.home') || (locale === 'bn' ? "হোম" : "Home") },
        { href: "/about", label: t('about') || (locale === 'bn' ? "আমাদের সম্পর্কে" : "About Us") },
        { href: "/notices", label: t('notices') || (locale === 'bn' ? "নোটিশ বোর্ড" : "Notices") },
        { href: "/teachers", label: t('teachers') || (locale === 'bn' ? "শিক্ষকবৃন্দ" : "Teachers") },
        { href: "/admission", label: t('admission') || (locale === 'bn' ? "ভর্তি" : "Admission") },
        { href: "/gallery", label: t('gallery') || (locale === 'bn' ? "গ্যালারি" : "Gallery") },
        { href: "/contact", label: t('contact') || (locale === 'bn' ? "যোগাযোগ" : "Contact") },
    ]

    return (
        <header className="w-full z-50">
            {/* Top Bar */}
            <div className="bg-school-navy text-white py-2 px-4 sm:px-8 border-b border-white/10">
                <div className="container mx-auto flex items-center justify-between text-[13px] font-medium">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-blue-300" />
                            <span>{settings?.phone || '+৮৮০ ১২৩৪ ৫৬৭৮৯০'}</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 border-l border-white/20 pl-6">
                            <Mail className="h-3.5 w-3.5 text-blue-300" />
                            <span>{settings?.email || 'info@school.edu.bd'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageToggle />
                        {!session && (
                            <Link href="/login" className="flex items-center gap-2 hover:text-blue-300 transition-colors">
                                <User className="h-3.5 w-3.5" />
                                <span>{t('top_login') || (locale === 'bn' ? "লগইন / রেজিস্ট্রেশন" : "Login / Register")}</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 shadow-sm z-50">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-school-navy text-white shadow-md transition-transform group-hover:scale-105">
                            {settings?.logoUrl ? (
                                <img src={settings.logoUrl} alt="Logo" className="h-8 w-8 object-contain" />
                            ) : (
                                <GraduationCap className="h-7 w-7" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xl text-slate-900 leading-tight">
                                {settings?.schoolNameBn || "আদর্শ বিদ্যালয়"}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                                {settings?.schoolNameEn || "Adarsha Bidyalaya"}
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden xl:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                        isActive
                                            ? "bg-slate-900 text-white shadow-lg"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link href="/admission" className="hidden sm:block">
                            <Button variant="outline" className="border-slate-200 text-slate-700 font-bold h-11 px-6 rounded-xl hover:bg-slate-50 transition-all">
                                {t('admission_info') || (locale === 'bn' ? "ভর্তি তথ্য" : "Admission Info")}
                            </Button>
                        </Link>
                        {session ? (
                            <div className="flex items-center gap-3">
                                <Button asChild variant="ghost" className="font-bold text-slate-700 hover:bg-slate-100 rounded-xl">
                                    <Link href="/admin">{t('portal_access') || (locale === 'bn' ? "পোর্টালে প্রবেশ করুন" : "Enter Portal")}</Link>
                                </Button>
                                <Button onClick={() => signOut()} variant="outline" size="sm" className="font-bold border-red-100 text-red-600 hover:bg-red-50 rounded-xl">
                                    {t('common.logout') || (locale === 'bn' ? "লগআউট" : "Logout")}
                                </Button>
                            </div>
                        ) : (
                            <Button asChild className="bg-school-navy hover:bg-slate-800 text-white font-black h-11 px-8 rounded-xl shadow-xl shadow-navy/20 transition-all hover:scale-105 active:scale-95">
                                <Link href="/login" className="flex items-center gap-2">
                                    {t('login_portal') || (locale === 'bn' ? "লগইন করুন" : "Login")}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
