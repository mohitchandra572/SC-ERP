'use client'

import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { authenticate } from '@/lib/auth/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { BookOpen, Users, Lightbulb, Award } from 'lucide-react'

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

    const features = [
        { icon: <BookOpen className="w-6 h-6" />, title: 'ডিজিটাল শিক্ষা', desc: 'অনলাইন ক্লাস ও রিসোর্স' },
        { icon: <Users className="w-6 h-6" />, title: 'শিক্ষার্থী ব্যবস্থাপনা', desc: 'সম্পূর্ণ রেকর্ড নিয়ন্ত্রণ' },
        { icon: <Lightbulb className="w-6 h-6" />, title: 'স্মার্ট বিশ্লেষণ', desc: 'পারফরম্যান্স ট্র্যাকিং' },
        { icon: <Award className="w-6 h-6" />, title: 'ফলাফল পরিচালনা', desc: 'স্বচ্ছ গ্রেডিং সিস্টেম' },
    ]

    const educationalQuotes = [
        'শিক্ষাই জাতির মেরুদণ্ড',
        'জ্ঞানই শক্তি',
        'শিক্ষা ছাড়া জাতি অন্ধ',
    ]

    const randomQuote = educationalQuotes[Math.floor(Math.random() * educationalQuotes.length)]

    return (
        <div className="relative min-h-screen flex overflow-hidden hero-gradient">
            {/* Left Panel - Educational Content */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex w-1/2 flex-col justify-between p-16 text-white relative z-10"
            >
                <div className="space-y-12">
                    <div>
                        <h1 className="text-5xl font-black font-bengali mb-3">আদর্শ উচ্চ বিদ্যালয়</h1>
                        <p className="text-blue-100/70 text-lg">আধুনিক শিক্ষা ব্যবস্থাপনা পোর্টাল</p>
                    </div>

                    <blockquote className="text-2xl font-bengali italic font-bold text-blue-100/90 border-l-4 border-blue-100/30 pl-6">
                        "{randomQuote}"
                    </blockquote>

                    <div className="space-y-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * (i + 1) }}
                                className="flex gap-4 items-start"
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100/10 flex items-center justify-center text-blue-100/80">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-base">{feature.title}</h3>
                                    <p className="text-sm text-blue-100/60">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="text-sm text-blue-100/50">
                    <p>© ২০২৬ আদর্শ উচ্চ বিদ্যালয়</p>
                </div>
            </motion.div>

            {/* Right Panel - Login Form */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10"
            >
                <Card className="w-full max-w-sm bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                    <div className="p-8 space-y-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: 'rgba(6, 95, 70, 0.08)' }}>
                                <BookOpen className="w-8 h-8" style={{ color: 'var(--color-school-navy)' }} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 font-bengali">পোর্টাল প্রবেশ</h2>
                            <p className="text-slate-500 text-sm mt-1 font-medium">আপনার অ্যাকাউন্ট দিয়ে লগইন করুন</p>
                        </div>

                        <form action={formAction} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-semibold">ইমেইল ঠিকানা</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="admin@school.com"
                                    className="h-11 rounded-lg border-slate-200 focus:ring-2"
                                    style={{ '--tw-ring-color': 'rgba(6, 95, 70, 0.3)' } as React.CSSProperties}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700 font-semibold">পাসওয়ার্ড</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="h-11 rounded-lg border-slate-200 focus:ring-2"
                                    style={{ '--tw-ring-color': 'rgba(6, 95, 70, 0.3)' } as React.CSSProperties}
                                />
                            </div>

                            {errorMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium"
                                >
                                    {errorMessage}
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-11 text-base font-bold font-bengali rounded-lg transition-all hover:scale-[1.02] active:scale-95"
                                style={{ backgroundColor: 'var(--color-school-green)', color: '#fff' }}
                            >
                                {isPending ? 'লগইন হচ্ছে...' : 'পোর্টালে প্রবেশ করুন'}
                            </Button>
                        </form>

                        <div className="pt-4 border-t border-slate-200/50">
                            <p className="text-center text-xs text-slate-500">
                                সহায়তার জন্য স্কুল অফিসে যোগাযোগ করুন
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}






