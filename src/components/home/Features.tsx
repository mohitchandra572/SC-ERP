'use client'

import { motion } from 'framer-motion'
import { BookOpen, Users, Trophy, Heart } from 'lucide-react'

const features = [
    {
        icon: <BookOpen className="h-8 w-8" style={{ color: 'var(--color-school-navy)' }} />,
        title: 'অ্যাকাডেমিক শ্রেষ্ঠত্ব',
        titleEn: 'Academic Excellence',
        description: 'সর্বাধুনিক কারিকুলাম এবং অভিজ্ঞ শিক্ষকমণ্ডলীর মাধ্যমে শিক্ষার্থীদের মেধা বিকাশ।',
        bgStart: 'var(--color-school-green)',
        bgEnd: 'var(--color-school-navy)'
    },
    {
        icon: <Trophy className="h-8 w-8" style={{ color: 'var(--color-school-gold)' }} />,
        title: 'আধুনিক সুযোগ-সুবিধা',
        titleEn: 'Modern Facilities',
        description: 'ডিজিটাল ক্লাসরুম, উন্নত ল্যাব এবং খেলার মাঠসহ ক্যাস্পাসে সব আধুনিক সুবিধা।',
        bgStart: 'var(--color-school-gold)',
        bgEnd: 'var(--color-school-teal)'
    },
    {
        icon: <Users className="h-8 w-8" style={{ color: 'var(--color-school-green)' }} />,
        title: 'অভিজ্ঞ শিক্ষকবৃন্দ',
        titleEn: 'Expert Faculty',
        description: 'প্রশিক্ষিত ও নিবেদিতপ্রাণ শিক্ষক মণ্ডলী যারা প্রতিটি শিক্ষার্থীর প্রতি যত্নশীল।',
        bgStart: 'var(--color-school-teal)',
        bgEnd: 'var(--color-school-navy)'
    },
    {
        icon: <Heart className="h-8 w-8" style={{ color: 'var(--color-school-gold)' }} />,
        title: 'চরিত্র গঠন',
        titleEn: 'Character Building',
        description: 'নৈতিক শিক্ষা ও মূল্যবোধের মাধ্যমে আদর্শ নাগরিক হিসেবে গড়ে তোলা।',
        bgStart: 'var(--color-school-navy)',
        bgEnd: 'var(--color-school-green)'
    }
]

const containerVariant = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
}

const itemVariant = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 15
        }
    }
}

export function Features() {
    return (
        <section className="py-32 px-4 bg-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container max-w-7xl mx-auto space-y-20 relative z-10">
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-school-navy/5 text-school-navy text-xs font-bold uppercase tracking-widest"
                    >
                        আমাদের বৈশিষ্ট্য কী?
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-slate-900 font-bengali tracking-tight"
                    >
                        কেন আমাদের স্কুল <span className="text-gradient">সেরা পছন্দ?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed"
                    >
                        আমরা কেবল শিক্ষাই দিই না, প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভাকে বিকশিত করার পরিবেশ তৈরি করি।
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariant}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-2"
                >
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariant}
                            whileHover={{ y: -12, transition: { duration: 0.3 } }}
                            className="relative group h-full"
                        >
                            <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" style={{ background: `linear-gradient(135deg, ${feature.bgStart} 0%, ${feature.bgEnd} 100%)` }} />

                            <div className="h-full bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] group-hover:shadow-2xl group-hover:shadow-slate-200/50 transition-all duration-500 flex flex-col justify-between">
                                <div className="space-y-8">
                                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center bg-slate-50 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                                        {feature.icon}
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black text-slate-900 font-bengali leading-tight">{feature.title}</h3>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{feature.titleEn}</p>
                                    </div>
                                    <p className="text-slate-500 leading-relaxed font-medium">
                                        {feature.description}
                                    </p>
                                </div>
                                <div className="pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="h-1.5 w-12 bg-school-navy rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
