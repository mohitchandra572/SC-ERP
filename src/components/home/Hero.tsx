'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Book, ArrowRight, Trophy } from 'lucide-react'
import Link from 'next/link'

interface HeroProps {
    schoolNameBn: string
    schoolNameEn: string
}

export function Hero({ schoolNameBn, schoolNameEn }: HeroProps) {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden text-white pt-24 pb-32 hero-gradient">

            {/* Decorative radial highlight */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_55%)]" />

            {/* Soft animated glow */}
            <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-40 left-1/2 -translate-x-1/2 w-130 h-130 bg-blue-500/10 blur-[140px] rounded-full"
            />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-6xl mx-auto space-y-10">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50/50 border border-blue-100/50 backdrop-blur-md text-sm font-semibold text-blue-700"
                >
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    একটি আধুনিক ও ডিজিটাল শিক্ষাঙ্গন
                </motion.div>

                {/* Icon */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    className="relative mx-auto w-28 h-28 rounded-2xl bg-white/95 border border-white/10 flex items-center justify-center shadow-xl"
                >
                    <Book className="w-14 h-14" style={{ color: 'var(--color-school-navy)' }} />
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--color-school-gold)' }}>
                        <Trophy className="w-5 h-5 text-slate-900" />
                    </div>
                </motion.div>

                {/* Headings */}
                <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="font-bengali text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-white"
                >
                    {schoolNameBn}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-blue-100/80 text-base sm:text-xl tracking-widest font-bold uppercase"
                >
                    {schoolNameEn}
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
                >
                    <Link href="/about">
                        <Button className="h-14 px-10 text-lg font-bengali rounded-xl shadow-lg" style={{ backgroundColor: 'var(--color-school-green)', color: '#fff' }}>
                            আরও জানুন <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>

                    <Link href="/login">
                        <Button
                            variant="outline"
                            className="h-14 px-10 text-lg font-bengali rounded-xl"
                            style={{ borderColor: 'rgba(255,255,255,0.14)', color: '#fff', backgroundColor: 'transparent' }}
                        >
                            পোর্টালে প্রবেশ
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
