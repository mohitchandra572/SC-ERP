'use client'

import { motion } from 'framer-motion'
import { Users, GraduationCap, Phone, Trophy } from 'lucide-react'

export function Statistics() {
    const stats = [
        { label: 'শিক্ষার্থী', value: '১২০০+', icon: Users, bgStart: 'rgba(30,58,138,0.06)', iconColor: 'var(--color-school-navy)' },
        { label: 'শিক্ষক-শিক্ষিকা', value: '৫০+', icon: GraduationCap, bgStart: 'rgba(6,95,70,0.06)', iconColor: 'var(--color-school-green)' },
        { label: 'শ্রেণীকক্ষ', value: '৩০+', icon: Phone, bgStart: 'rgba(251,191,36,0.08)', iconColor: 'var(--color-school-gold)' },
        { label: 'সাফল্যের হার', value: '৯৮%', icon: Trophy, bgStart: 'rgba(19,78,74,0.06)', iconColor: 'var(--color-school-teal)' },
    ]

    return (
        <section aria-label="School statistics" className="py-24 bg-transparent relative overflow-hidden">
            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                <ul className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center group"
                            aria-label={`${stat.label}: ${stat.value}`}
                        >
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500" style={{ background: stat.bgStart }}>
                                    <stat.icon className="h-8 w-8" style={{ color: stat.iconColor }} />
                                </div>
                            </div>
                            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-1 leading-none">{stat.value}</h3>
                            <p className="text-slate-500 font-bold font-bengali text-sm sm:text-base">{stat.label}</p>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
