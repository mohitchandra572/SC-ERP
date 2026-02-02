'use client'

import { GraduationCap, Mail, Phone, MapPin, Facebook, Youtube, Twitter } from "lucide-react"
import { useTranslation } from "@/lib/i18n/i18n-provider"
import Link from "next/link"

export function PublicFooter({ settings }: { settings: any }) {
    const { t, locale } = useTranslation()

    return (
        <footer className="w-full bg-school-navy text-slate-300 pt-20 pb-10">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20">
                                <GraduationCap className="h-7 w-7" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl text-white">
                                    {settings?.schoolNameBn || "আদর্শ বিদ্যালয়"}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                                    {settings?.schoolNameEn || "Adarsha Bidyalaya"}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-400 max-w-sm font-medium">
                            শিক্ষার আলোয় আলোকিত করি প্রতিটি জীবন। মানসম্মত শিক্ষা ও নৈতিক মূল্যবোধের বিকাশে আমরা প্রতিশ্রুতিবদ্ধ।
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { icon: <Facebook className="h-5 w-5" />, href: "#" },
                                { icon: <Youtube className="h-5 w-5" />, href: "#" },
                                { icon: <Twitter className="h-5 w-5" />, href: "#" },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 hover:text-white transition-all border border-white/10"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h4 className="font-bold text-white text-lg border-b border-white/10 pb-2">{t('nav.footer.links') || "দ্রুত লিঙ্ক"}</h4>
                        <nav className="flex flex-col gap-3">
                            <Link href="/about" className="text-sm hover:text-white transition-colors">আমাদের সম্পর্কে</Link>
                            <Link href="/teachers" className="text-sm hover:text-white transition-colors">শিক্ষকবৃন্দ</Link>
                            <Link href="/notices" className="text-sm hover:text-white transition-colors">নোটিশ বোর্ড</Link>
                            <Link href="/gallery" className="text-sm hover:text-white transition-colors">গ্যালারি</Link>
                            <Link href="/admission" className="text-sm hover:text-white transition-colors">ভর্তি তথ্য</Link>
                        </nav>
                    </div>

                    {/* Portals */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h4 className="font-bold text-white text-lg border-b border-white/10 pb-2">পোর্টাল</h4>
                        <nav className="flex flex-col gap-3">
                            <Link href="/login" className="text-sm hover:text-white transition-colors">শিক্ষার্থী পোর্টাল</Link>
                            <Link href="/login" className="text-sm hover:text-white transition-colors">শিক্ষক পোর্টাল</Link>
                            <Link href="/login" className="text-sm hover:text-white transition-colors">অভিভাবক পোর্টাল</Link>
                            <Link href="/login" className="text-sm hover:text-white transition-colors">প্রশাসন</Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <h4 className="font-bold text-white text-lg border-b border-white/10 pb-2">যোগাযোগ</h4>
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-white/5 border border-white/10">
                                    <MapPin className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="text-sm leading-relaxed text-slate-400">
                                    ১২৩ শিক্ষা সড়ক, ঢাকা-১২০০, বাংলাদেশ
                                </span>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-white/5 border border-white/10">
                                    <Phone className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="text-sm text-slate-400">
                                    {settings?.phone || '+৮৮০ ১২৩৪ ৫৬৭৮৯০'}
                                </span>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-white/5 border border-white/10">
                                    <Mail className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="text-sm text-slate-400">
                                    {settings?.email || 'info@school.edu.bd'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
                    <p>© {new Date().getFullYear()} {settings?.schoolNameBn || "আদর্শ বিদ্যালয়"}। সর্বস্বত্ব সংরক্ষিত।</p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-slate-300">গোপনীয়তা নীতি</Link>
                        <Link href="/terms" className="hover:text-slate-300">ব্যবহারের শর্তাবলী</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
