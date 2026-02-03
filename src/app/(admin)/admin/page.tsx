import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import { getServerTranslation } from "@/lib/i18n/server"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/ui/cn"

export default async function AdminDashboard() {
    const session = await auth()
    if (!session) redirect("/login")

    const { t } = await getServerTranslation()

    return (
        <PageShell>
            <PageHeader
                title={t('admin.dashboard.title')}
                description={t('admin.dashboard.welcome', { name: session.user?.name || '' })}
            />

            <div className="space-y-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: t('admin.dashboard.stats.students'), value: '1,248', icon: 'users', bgStart: 'rgba(30,58,138,0.08)', bgEnd: 'rgba(30,58,138,0.02)', color: 'var(--color-school-navy)', trend: t('admin.dashboard.stats.thisMonth') },
                        { label: t('admin.dashboard.stats.teachers'), value: '42', icon: 'graduation-cap', bgStart: 'rgba(6,95,70,0.08)', bgEnd: 'rgba(6,95,70,0.02)', color: 'var(--color-school-green)', trend: t('admin.dashboard.stats.fullFaculty') },
                        { label: t('admin.dashboard.stats.revenue'), value: '৳ 4.2M', icon: 'fees', bgStart: 'rgba(251,191,36,0.10)', bgEnd: 'rgba(251,191,36,0.02)', color: 'var(--color-school-gold)', trend: t('admin.dashboard.stats.ytd') },
                        { label: t('admin.dashboard.stats.notices'), value: '8', icon: 'notices', bgStart: 'rgba(19,78,74,0.08)', bgEnd: 'rgba(19,78,74,0.02)', color: 'var(--color-school-teal)', trend: t('admin.dashboard.stats.activeToday') }
                    ].map((stat, i) => (
                        <div key={i} className="premium-card p-6 flex flex-col gap-4 group hover:shadow-lg transition-all duration-300" style={{ backgroundImage: `linear-gradient(135deg, ${stat.bgStart} 0%, ${stat.bgEnd} 100%)` }}>
                            <div className="flex items-center justify-between">
                                <div className="stat-icon-container text-white shadow-lg" style={{ backgroundColor: stat.color }}>
                                    <span className="h-6 w-6">
                                        {stat.icon === 'users' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                                        {stat.icon === 'graduation-cap' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12.5V16a6 6 0 0 0 12 0v-3.5" /></svg>}
                                        {stat.icon === 'fees' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>}
                                        {stat.icon === 'notices' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-slate-100/50">
                                <span className="text-[11px] font-medium text-slate-400">{stat.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions (2 col) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                {t('admin.dashboard.quickActions')}
                            </h2>
                        </div>
                            {[
                                { label: t('admin.dashboard.actions.attendance'), desc: t('admin.dashboard.actions.attendanceDesc'), bgColor: 'rgba(6,95,70,0.06)', iconColor: 'var(--color-school-green)', route: '/teacher/attendance' },
                                { label: t('admin.dashboard.actions.results'), desc: t('admin.dashboard.actions.resultsDesc'), bgColor: 'rgba(30,58,138,0.06)', iconColor: 'var(--color-school-navy)', route: '/admin/exams' },
                                { label: t('admin.dashboard.actions.fees'), desc: t('admin.dashboard.actions.feesDesc'), bgColor: 'rgba(19,78,74,0.06)', iconColor: 'var(--color-school-teal)', route: '/admin/accounting' },
                                { label: t('admin.dashboard.actions.users'), desc: t('admin.dashboard.actions.usersDesc'), bgColor: 'rgba(251,191,36,0.06)', iconColor: 'var(--color-school-gold)', route: '/admin/users' }
                            ].map((action, i) => (
                                <button key={i} className="premium-card p-5 text-left hover:scale-[1.02] hover:shadow-md flex items-center gap-5 group transition-all duration-300" style={{ backgroundColor: action.bgColor }}>
                                    <div className="stat-icon-container !h-12 !w-12 shrink-0 rounded-xl text-white" style={{ backgroundColor: action.iconColor }}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 group-hover:opacity-80 transition-opacity">{action.label}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{action.desc}</p>
                                    </div>
                                </button>
                            ))}
                    </div>

                    {/* Activity Feed (1 col) */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            {t('admin.dashboard.recentActivity')}
                        </h2>
                        <div className="premium-card p-6">
                            <div className="space-y-8">
                                {[
                                    { user: 'System', action: 'ডেইলী অ্যাটেনডেন্স ব্যাকআপ সম্পন্ন হয়েছে', time: '২ মিনিট আগে' },
                                    { user: 'Admin', action: 'নতুন স্টাফ মেম্বার নিবন্ধিত হয়েছে', time: '৪৫ মিনিট আগে' },
                                    { user: 'Accountant', action: 'মাসিক ফি ইনভয়েস জেনারেট করা হয়েছে', time: '২ ঘণ্টা আগে' },
                                    { user: 'Teacher', action: 'গণিত পরীক্ষার ফলাফল আপডেট করা হয়েছে', time: 'গতকাল' }
                                ].map((activity, i) => (
                                    <div key={i} className="flex gap-4 relative">
                                        {i !== 3 && <div className="absolute left-4 top-10 bottom-[-2rem] w-px bg-slate-100" />}
                                        <div className="h-8 w-8 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-400 ring-4 ring-white">
                                            {activity.user === 'System' ? 'S' : activity.user[0]}
                                        </div>
                                        <div className="space-y-1 pt-0.5">
                                            <p className="text-[13px] font-medium text-slate-900 leading-snug">
                                                <span className="font-bold text-primary">{activity.user}</span> {activity.action}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    )
}






