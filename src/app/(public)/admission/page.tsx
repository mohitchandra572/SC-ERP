'use client'

import { PageHeader } from "@/components/layout/page-header"
import { motion } from "framer-motion"
import { CheckCircle2, FileText, ClipboardList, Wallet, ArrowRight, Download } from "lucide-react"

const steps = [
    {
        titleBn: "আবেদন ফর্ম সংগ্রহ",
        titleEn: "Get Application Form",
        descBn: "অনলাইন থেকে অথবা স্কুল অফিস থেকে সরাসরি আবেদন ফর্ম সংগ্রহ করুন।",
        icon: <FileText className="w-8 h-8" />,
        color: "bg-blue-50 text-blue-600"
    },
    {
        titleBn: "ফর্ম পূরণ ও জমা",
        titleEn: "Fill & Submit Form",
        descBn: "প্রয়োজনীয় নথিপত্রসহ পূরণকৃত ফর্মটি অনলাইনে অথবা অফিস কাউন্টারে জমা দিন।",
        icon: <ClipboardList className="w-8 h-8" />,
        color: "bg-purple-50 text-purple-600"
    },
    {
        titleBn: "ভর্তি পরীক্ষা (প্রযোজ্য ক্ষেত্রে)",
        titleEn: "Admission Test",
        descBn: "যোগ্যতা যাচাইয়ের জন্য নির্ধারিত দিনে ভর্তি পরীক্ষায় অংশগ্রহণ করুন।",
        icon: <CheckCircle2 className="w-8 h-8" />,
        color: "bg-emerald-50 text-emerald-600"
    },
    {
        titleBn: "ফি পরিশোধ ও ভর্তি নিশ্চিতকরণ",
        titleEn: "Fee Payment",
        descBn: "সফলভাবে উত্তীর্ণ হওয়ার পর ভর্তি ফি পরিশোধ করে আপনার ভর্তি নিশ্চিত করুন।",
        icon: <Wallet className="w-8 h-8" />,
        color: "bg-amber-50 text-amber-600"
    }
]

const feeStructure = [
    { classBn: "৬ষ্ঠ শ্রেণী", classEn: "Class 6", admissionBn: "৫০০০৳", monthlyBn: "১০০০৳" },
    { classBn: "৭ম শ্রেণী", classEn: "Class 7", admissionBn: "৫০০০৳", monthlyBn: "১০০০৳" },
    { classBn: "৮ম শ্রেণী", classEn: "Class 8", admissionBn: "৫৫০০৳", monthlyBn: "১২০০৳" },
    { classBn: "৯ম শ্রেণী", classEn: "Class 9", admissionBn: "৬০০০৳", monthlyBn: "১৫০০৳" },
    { classBn: "১০ম শ্রেণী", classEn: "Class 10", admissionBn: "৬০০০৳", monthlyBn: "১৫০০৳" }
]

export default function AdmissionPage() {
    return (
        <div className="container mx-auto px-4 max-w-7xl">
            <PageHeader
                variant="hero"
                title="ভর্তি সংক্রান্ত তথ্য"
                description="আপনার সন্তানের উন্নত ভবিষ্যৎ গড়ার লক্ষ্যে আমাদের সাথে যুক্ত হন। আমরা প্রদান করছি মানসম্মত আধুনিক শিক্ষা।"
            />

            {/* Admission Steps */}
            <div className="mb-24">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black font-bengali text-slate-900">ভর্তি প্রক্রিয়া</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium">নিচের সহজ ধাপগুলো অনুসরণ করে আপনার ভর্তি সম্পন্ন করুন।</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/50 shadow-xl relative group"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 font-bengali">{step.titleBn}</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                {step.descBn}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Fee Structure */}
            <div className="mb-24">
                <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-slate-200/50 shadow-2xl overflow-hidden">
                    <div className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black font-bengali text-slate-900">বেতন ও ভর্তি ফি</h2>
                                <p className="text-slate-500 font-medium">২০২৪ শিক্ষাবর্ষের নির্ধারিত ফি কাঠামো</p>
                            </div>
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm">
                                <Download className="w-5 h-5" /> পূর্ণাঙ্গ ফি তালিকা
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">শ্রেণীসমূহ</th>
                                    <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">ভর্তি ফি</th>
                                    <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">মাসিক বেতন</th>
                                    <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {feeStructure.map((row, i) => (
                                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="font-black text-slate-900 text-lg font-bengali">{row.classBn}</div>
                                            <div className="text-sm text-slate-400 font-bold">{row.classEn}</div>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-slate-700 text-lg">{row.admissionBn}</td>
                                        <td className="px-8 py-6 font-bold text-slate-700 text-lg">{row.monthlyBn}</td>
                                        <td className="px-8 py-6">
                                            <button className="text-blue-600 font-black text-sm hover:underline flex items-center gap-1">
                                                ভর্তি হোন <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 md:p-20 mb-24 text-center text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black font-bengali leading-tight">ভর্তি হতে ইচ্ছুক? এখনই আবেদন করুন</h2>
                    <p className="text-blue-100/80 text-xl font-medium">
                        সময় সীমিত। আপনার পছন্দের শ্রেণীতে সিট নিশ্চিত করতে আজই অনলাইনে আবেদন সম্পন্ন করুন।
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                        <button className="w-full sm:w-auto bg-white text-blue-700 font-black px-12 py-5 rounded-2xl hover:bg-blue-50 transition-all hover:scale-105 shadow-xl text-lg">
                            অনলাইন আবেদন
                        </button>
                        <button className="w-full sm:w-auto bg-blue-500/20 backdrop-blur-md border border-white/20 text-white font-black px-12 py-5 rounded-2xl hover:bg-white/10 transition-all text-lg">
                            প্রোসপেক্টাস ডাউনলোড
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
