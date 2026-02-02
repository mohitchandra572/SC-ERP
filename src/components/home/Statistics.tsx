'use client'

import { motion } from 'framer-motion'
import { Users, GraduationCap, Phone, Trophy } from 'lucide-react'

export function Statistics() {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {[
                        { label: 'শিক্ষার্থী', value: '১২০০+', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
                        { label: 'শিক্ষক-শিক্ষিকা', value: '৫০+', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                        { label: 'শ্রেণীকক্ষ', value: '৩০+', icon: Phone, color: 'text-gold-600', bg: 'bg-amber-100' },
                        { label: 'সাফল্যের হার', value: '৯৮%', icon: Trophy, color: 'text-rose-600', bg: 'bg-rose-100' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center group"
                        >
                            <div className="flex justify-center mb-4">
                                <div className={`w-16 h-16 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-1 leading-none">{stat.value}</h3>
                            <p className="text-slate-500 font-bold font-bengali text-sm sm:text-base">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
