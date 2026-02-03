import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import { getResolvedNavigation } from "@/lib/customization/resolve"
import { getServerTranslation } from "@/lib/i18n/server"
import { DynamicNav } from "./_components/dynamic-nav"
import { GraduationCap, Menu, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileNav } from "./_components/mobile-nav"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const navigation = await getResolvedNavigation(session)
    const { t, locale } = await getServerTranslation()

    return (
        <div className="flex min-h-screen bg-slate-50/50 font-sans">
            {/* Sidebar (Desktop) */}
            <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen transition-all duration-300" style={{ borderRightColor: 'rgba(6, 95, 70, 0.06)' }}>
                <div className="p-6 border-b flex items-center gap-3" style={{ borderBottomColor: 'rgba(6, 95, 70, 0.06)' }}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-lg" style={{ backgroundColor: 'var(--color-school-green)' }}>
                        <GraduationCap className="h-5 w-5" />
                    </div>
                    <h2 className="font-bold text-lg tracking-tight text-slate-900">{t('admin.portalName')}</h2>
                </div>
                <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                    <DynamicNav items={navigation} />
                </nav>
                <div className="p-4 border-t bg-white" style={{ borderTopColor: 'rgba(6, 95, 70, 0.06)' }}>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/60 shadow-sm">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white" style={{ backgroundColor: 'var(--color-school-navy)' }}>
                            {session.user?.name?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{session.user?.name}</p>
                            <p className="text-[10px] font-medium text-slate-400 truncate uppercase tracking-wider mt-0.5">
                                {(session.user as any)?.roles?.[0] || t('admin.users.noRoles')}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 min-h-screen bg-white">
                <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40" style={{ borderBottomColor: 'rgba(6, 95, 70, 0.06)' }}>
                    <div className="flex items-center gap-4">
                        <MobileNav items={navigation} />
                        <span className="text-xs font-bold text-slate-400 tracking-widest uppercase hidden sm:block">
                            {t('admin.systemName')}
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 px-4 py-2 rounded-full border" style={{ backgroundColor: 'rgba(6, 95, 70, 0.04)', borderColor: 'rgba(6, 95, 70, 0.08)' }}>
                            <Calendar className="h-4 w-4" style={{ color: 'var(--color-school-green)' }} />
                            {new Date().toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </div>
                    </div>
                </header>
                <div className="flex-1 p-4 sm:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

