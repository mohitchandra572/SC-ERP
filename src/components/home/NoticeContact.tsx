'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NoticeContact() {
    return (
        <section className="py-32 px-4 bg-white relative">
            <div className="container max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-24">
                    {/* Notices / Updates */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                                <h2 className="text-4xl font-black text-slate-900 font-bengali">সর্বশেষ আপডেট</h2>
                            </div>
                            <p className="text-slate-500 font-medium text-lg">আমাদের স্কুলের সাম্প্রতিক কার্যক্রম এবং জরুরি ঘোষণাগুলো জানুন।</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { title: 'গ্রীষ্মকালীন ছুটি শুরু হচ্ছে আগামী ১লা জুন থেকে।', date: '২০ মে, ২০২৪', icon: '☀️' },
                                { title: 'বার্ষিক পরীক্ষার ফলাফল আগামী সপ্তাহে প্রকাশিত হবে।', date: '১৮ মে, ২০২৪', icon: '📝' },
                                { title: 'অভিভাবক সমাবেশ আগামী শুক্রবার সকাল ১০ টায়।', date: '১৫ মে, ২০২৪', icon: '👥' },
                            ].map((notice, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 10 }}
                                    className="group flex gap-6 p-6 rounded-[2rem] border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer"
                                >
                                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-white shadow-sm border border-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        {notice.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{notice.date}</p>
                                        <h4 className="text-slate-900 font-bold font-bengali text-xl leading-snug group-hover:text-blue-600 transition-colors">{notice.title}</h4>
                                    </div>
                                </motion.div>
                            ))}
                            <div className="pt-4">
                                <Button variant="link" className="text-blue-600 font-black p-0 h-auto font-bengali text-xl flex items-center gap-2 group">
                                    সবগুলো নোটিশ দেখুন
                                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact / Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-emerald-600 rounded-full" />
                                <h2 className="text-4xl font-black text-slate-900 font-bengali">যোগাযোগ করুন</h2>
                            </div>
                            <p className="text-slate-500 font-medium text-lg">যে কোনো প্রশ্ন বা তথ্যের জন্য আমাদের সাথে যোগাযোগ করতে পারেন।</p>
                        </div>

                        <div className="grid gap-8">
                            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                                        <Phone className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">কল করুন</p>
                                        <p className="text-slate-900 font-black text-2xl">+৮৮০ ১৭০০ ০০০০০০</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 border border-slate-100">
                                        <Mail className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">ইমেইল করুন</p>
                                        <p className="text-slate-900 font-black text-2xl">info@school.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rose-600 border border-slate-100">
                                        <MapPin className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">ঠিকানা</p>
                                        <p className="text-slate-900 font-black text-2xl">ঢাকা, বাংলাদেশ</p>
                                    </div>
                                </div>
                            </div>

                            {/* Visiting Hours Card */}
                            <div className="bg-school-navy p-10 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-blue-900/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <h4 className="text-2xl font-black font-bengali tracking-tight">সাক্ষাতের সময়</h4>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-slate-300 border-b border-white/5 pb-4">
                                        <span className="font-medium text-lg">শনিবার - বৃহস্পতিবার</span>
                                        <span className="font-bold text-school-gold text-lg">০৯:০০ AM - ০৪:০০ PM</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-300">
                                        <span className="font-medium text-lg">শুক্রবার</span>
                                        <span className="font-black text-rose-400 uppercase tracking-widest">বন্ধ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
