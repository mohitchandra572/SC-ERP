'use client'

import { motion } from 'framer-motion'
import { GraduationCap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HomeCTA() {
    return (
        <section className="py-32 px-4 bg-slate-900 text-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(30,58,138,0.2),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(6,95,70,0.15),transparent_50%)]" />

            <div className="container max-w-5xl mx-auto relative z-10 text-center space-y-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                    <GraduationCap className="h-5 w-5 text-school-gold" />
                    <span className="text-sm font-bold uppercase tracking-widest text-blue-100/80">ভর্তি চলছে - ২০২৩ শিক্ষাবর্ষ</span>
                </motion.div>

                <div className="space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl lg:text-7xl font-black font-bengali leading-tight"
                    >
                        আপনার সন্তানের <span className="text-school-gold">উজ্জ্বল ভবিষ্যৎ</span> এর শুরু এখান থেকেই
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-blue-100/60 max-w-3xl mx-auto font-medium"
                    >
                        মানসম্মত শিক্ষা ও আধুনিক পরিবেশের সমন্বয়ে আমরা গড়ছি আগামীর নেতৃত্ব। আজই যোগ দিন আমাদের পরিবারের সাথে।
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
                >
                    <Link href="/admission" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-school-gold text-school-navy hover:bg-white font-black h-16 px-12 rounded-2xl transition-all hover:scale-105 active:scale-95 text-xl font-bengali flex items-center gap-3">
                            ভর্তি ফরম ডাউনলোড করুন
                            <ArrowRight className="h-6 w-6" />
                        </Button>
                    </Link>
                    <Link href="/contact" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/5 font-black h-16 px-12 rounded-2xl backdrop-blur-sm transition-all hover:scale-105 active:scale-95 text-xl font-bengali">
                            সাক্ষাতের সময় নিন
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Floating decorative elements */}
            <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-20 right-[10%] w-32 h-32 bg-blue-500 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ y: [0, 20, 0], opacity: [0.05, 0.15, 0.05] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="absolute bottom-10 left-[5%] w-48 h-48 bg-emerald-500 rounded-full blur-3xl"
            />
        </section>
    )
}
