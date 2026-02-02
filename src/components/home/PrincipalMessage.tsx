'use client'

import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

export function PrincipalMessage() {
    return (
        <section className="py-32 bg-white overflow-hidden">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
                            <div className="aspect-[4/5] bg-slate-200 relative flex items-center justify-center">
                                {/* Placeholder for Principal's Photo */}
                                <Users className="h-32 w-32 text-slate-400 opacity-20" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                            </div>
                        </div>
                        {/* Decorative background shape */}
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-100 rounded-full blur-[80px] -z-10" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest">
                                অধ্যক্ষের কথা
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 font-bengali leading-tight">
                                এসো শিখি, <span className="text-blue-600">গড়ি আগামী</span>
                            </h2>
                        </div>

                        <div className="relative group">
                            <span className="absolute -top-6 -left-8 text-8xl text-blue-100 font-serif leading-none opacity-50 group-hover:text-blue-200 transition-colors cursor-default">“</span>
                            <p className="text-xl text-slate-600 leading-relaxed font-medium italic relative z-10">
                                আমাদের লক্ষ্য হচ্ছে শিক্ষার্থীদের কেবল শিক্ষিত করা নয়, বরং তাদের সুনাগরিক হিসেবে গড়ে তোলা। আধুনিক প্রযুক্তি এবং নৈতিক শিক্ষার সমন্বয়ে আমরা এক অনন্য শিক্ষা পরিবেশ নিশ্চিত করছি। আপনার সন্তানের উজ্জ্বল ভবিষ্যতে আমরা পাশে আছি।
                            </p>
                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <h4 className="text-2xl font-black text-slate-900 font-bengali">মোহাম্মদ আব্দুল মজিদ</h4>
                                <p className="text-blue-600 font-bold uppercase tracking-wider text-sm mt-1">অধ্যক্ষ, আদর্শ উচ্চ বিদ্যালয়</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
