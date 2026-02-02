'use client'

import { PageHeader } from "@/components/layout/page-header"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Send, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const contactInfo = [
    {
        icon: <MapPin className="w-6 h-6" />,
        titleBn: "আমাদের ঠিকানা",
        titleEn: "Address",
        detailBn: "ভাটারা, ঢাকা-১২১২, বাংলাদেশ",
        detailEn: "Vatara, Dhaka-1212, Bangladesh",
        color: "bg-blue-50 text-blue-600"
    },
    {
        icon: <Phone className="w-6 h-6" />,
        titleBn: "ফোন করুন",
        titleEn: "Call Us",
        detailBn: "+৮৮০ ১৭০০০০০০০০",
        detailEn: "+880 1700000000",
        color: "bg-emerald-50 text-emerald-600"
    },
    {
        icon: <Mail className="w-6 h-6" />,
        titleBn: "ইমেইল পাঠান",
        titleEn: "Email Us",
        detailBn: "info@school.com",
        detailEn: "info@school.com",
        color: "bg-purple-50 text-purple-600"
    },
    {
        icon: <Clock className="w-6 h-6" />,
        titleBn: "অফিস সময়",
        titleEn: "Office Hours",
        detailBn: "শনিবার - বৃহস্পতিবার (সকাল ৮:০০ - বিকাল ৪:০০)",
        detailEn: "Sat - Thu (8:00 AM - 4:00 PM)",
        color: "bg-amber-50 text-amber-600"
    }
]

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 max-w-7xl">
            <PageHeader
                variant="hero"
                title="যোগাযোগ করুন"
                description="আপনার যেকোনো জিজ্ঞাসা বা পরামর্শের জন্য আমাদের সাথে যোগাযোগ করুন। আমরা দ্রুত আপনার উত্তর দিতে প্রতিশ্রুতিবদ্ধ।"
            />

            <div className="grid lg:grid-cols-3 gap-12 mb-24">
                {/* Contact Information */}
                <div className="lg:col-span-1 space-y-6">
                    {contactInfo.map((info, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/50 shadow-xl flex items-start gap-6 group hover:-translate-y-1 transition-all"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
                                {info.icon}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-slate-900 font-bengali">{info.titleBn}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">{info.detailBn}</p>
                                <p className="text-slate-400 text-sm font-bold uppercase">{info.detailEn}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-slate-200/50 shadow-2xl p-8 md:p-12"
                    >
                        <div className="mb-10 space-y-2">
                            <h2 className="text-3xl font-black font-bengali text-slate-900">সরাসরি মেসেজ পাঠান</h2>
                            <p className="text-slate-500 font-medium">নিচের ফর্মটি পূরণ করুন, আমরা খুব শীঘ্রই আপনার কাছে ফিরে আসব।</p>
                        </div>

                        <form className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-slate-700 font-bengali px-1">আপনার নাম</label>
                                    <Input
                                        placeholder="উদা: মোঃ আব্দুল হাই"
                                        className="h-14 rounded-2xl border-slate-200 bg-white/50 focus:bg-white focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-slate-700 font-bengali px-1">ইমেইল ঠিকানা</label>
                                    <Input
                                        type="email"
                                        placeholder="email@example.com"
                                        className="h-14 rounded-2xl border-slate-200 bg-white/50 focus:bg-white focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-700 font-bengali px-1">বিষয়</label>
                                <Input
                                    placeholder="আপনার মেসেজের মূল বিষয়"
                                    className="h-14 rounded-2xl border-slate-200 bg-white/50 focus:bg-white focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black text-slate-700 font-bengali px-1">আপনার মেসেজ</label>
                                <Textarea
                                    placeholder="বিস্তারিত এখানে লিখুন..."
                                    className="min-h-[160px] rounded-[2rem] border-slate-200 bg-white/50 focus:bg-white focus:ring-blue-500 transition-all font-medium p-6"
                                />
                            </div>

                            <Button className="w-full h-14 bg-school-navy hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-navy/20 transition-all hover:scale-[1.02] active:scale-95 text-lg gap-2">
                                মেসেজ পাঠান <Send className="w-5 h-5" />
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Map Placeholder */}
            <div className="mb-24 rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden h-[500px] relative bg-slate-100 group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&q=80')] bg-cover bg-center grayscale opacity-50 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
                    <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 max-w-md shadow-2xl text-center space-y-4">
                        <MapPin className="w-12 h-12 text-red-500 mx-auto" />
                        <h3 className="text-2xl font-black text-slate-900 font-bengali">ম্যাপে আমাদের অবস্থান</h3>
                        <p className="text-slate-600 font-medium">নিচের ঠিকানায় সরাসরি যোগাযোগ করার জন্য ম্যাপটি অনুসরণ করুন।</p>
                        <Button variant="outline" className="rounded-xl font-bold border-slate-200 text-slate-700">Open Google Maps</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
