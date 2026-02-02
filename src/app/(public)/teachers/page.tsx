'use client'

import { PageHeader } from "@/components/layout/page-header"
import { motion } from "framer-motion"
import { Mail, Phone, BookOpen, GraduationCap } from "lucide-react"

const teachers = [
    {
        nameBn: "এ. কে. এম. মোস্তফা কামাল",
        nameEn: "A.K.M. Mostafa Kamal",
        titleBn: "প্রধান শিক্ষক",
        titleEn: "Headmaster",
        subjectBn: "গণিত",
        subjectEn: "Mathematics",
        image: "https://images.unsplash.com/photo-1544168190-79c17527004f?w=400&h=400&fit=crop",
        email: "principal@school.com"
    },
    {
        nameBn: "মোছাঃ ফাতেমা বেগম",
        nameEn: "Most. Fatema Begum",
        titleBn: "সহকারী প্রধান শিক্ষক",
        titleEn: "Assistant Headmaster",
        subjectBn: "ইংরেজি",
        subjectEn: "English",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
        email: "fatema@school.com"
    },
    {
        nameBn: "মোঃ আব্দুল হাই",
        nameEn: "Md. Abdul Hai",
        titleBn: "সিনিয়র শিক্ষক",
        titleEn: "Senior Teacher",
        subjectBn: "ভৌত বিজ্ঞান",
        subjectEn: "Physical Science",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        email: "abdul@school.com"
    },
    {
        nameBn: "মোছাঃ জান্নাতুল ফেরদৌস",
        nameEn: "Most. Jannatul Ferdous",
        titleBn: "সহকারী শিক্ষক",
        titleEn: "Assistant Teacher",
        subjectBn: "বাংলা",
        subjectEn: "Bengali",
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop",
        email: "jannat@school.com"
    },
    {
        nameBn: "মোঃ জাহিদুল ইসলাম",
        nameEn: "Md. Zahidul Islam",
        titleBn: "সহকারী শিক্ষক",
        titleEn: "Assistant Teacher",
        subjectBn: "সমাজ বিজ্ঞান",
        subjectEn: "Social Science",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
        email: "zahid@school.com"
    },
    {
        nameBn: "মোছাঃ নাজমুন নাহার",
        nameEn: "Most. Najmun Nahar",
        titleBn: "সহকারী শিক্ষক",
        titleEn: "Assistant Teacher",
        subjectBn: "জীববিজ্ঞান",
        subjectEn: "Biology",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
        email: "najmun@school.com"
    }
]

export default function TeachersPage() {
    return (
        <div className="container mx-auto px-4 max-w-7xl">
            <PageHeader
                variant="hero"
                title="আমাদের নিবেদিত প্রাণ শিক্ষকবৃন্দ"
                description="অভিজ্ঞ ও দক্ষ শিক্ষক মন্ডলীর সঠিক নির্দেশনায় আপনার সন্তানের উজ্জ্বল ভবিষ্যৎ নিশ্চিত করুন।"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                {teachers.map((teacher, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/70 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-xl overflow-hidden hover:-translate-y-2 transition-all duration-500 group"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={teacher.image}
                                alt={teacher.nameEn}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        <div className="p-8 space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-slate-900 font-bengali tracking-tight">
                                    {teacher.nameBn}
                                </h3>
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
                                    {teacher.nameEn}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold">
                                    <GraduationCap className="w-4 h-4" />
                                    {teacher.titleBn}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold">
                                    <BookOpen className="w-4 h-4" />
                                    {teacher.subjectBn}
                                </span>
                            </div>

                            <div className="pt-4 border-t border-slate-100 space-y-3">
                                <div className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium">{teacher.email}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-school-navy rounded-[3rem] p-12 mb-24 text-center text-white relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <h2 className="text-3xl md:text-4xl font-black font-bengali">আপনি কি আমাদের সাথে যোগ দিতে চান?</h2>
                    <p className="text-blue-100/80 text-lg font-medium">
                        আমরা সবসময় মেধাবী ও নিবেদিত প্রাণ শিক্ষকদের খুঁজছি যারা মানসম্মত শিক্ষা প্রদানে প্রতিশ্রুতিবদ্ধ।
                    </p>
                    <div className="pt-4">
                        <button className="bg-white text-school-navy font-black px-10 py-4 rounded-2xl hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-xl">
                            আবেদন করুন
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
