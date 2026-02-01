import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import { getResolvedNavigation } from "@/lib/customization/resolve"
import { getServerTranslation } from "@/lib/i18n/server"
import { DynamicNav } from "@/app/(admin)/admin/_components/dynamic-nav"
import { GraduationCap, UserCircle } from "lucide-react"

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    // Ensure user has student-level access
    const isStudent = (session.user as any).roles?.some((r: string) => ['STUDENT', 'SCHOOL_ADMIN'].includes(r))
    if (!isStudent) {
        redirect("/forbidden")
    }

    const navigation = await getResolvedNavigation(session)
    const { t } = await getServerTranslation()

    return (
        <div className="flex min-h-screen bg-slate-50/50 font-sans">
            {/* Sidebar (Desktop) */}
            <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen transition-all duration-300">
                <div className="p-6 border-b flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                    <h2 className="font-bold text-lg tracking-tight text-slate-900">{t('student.portalName') || 'Student Portal'}</h2>
                </div>
                <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                    <DynamicNav items={navigation} />
                </nav>
                <div className="p-4 border-t bg-slate-50/50">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold ring-2 ring-white">
                            {session.user?.name?.[0] || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{session.user?.name}</p>
                            <p className="text-[10px] font-medium text-slate-400 truncate uppercase mt-0.5">Student</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen">
                <header className="h-16 border-b bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-4 lg:hidden">
                        <GraduationCap className="h-6 w-6 text-indigo-600" />
                        <span className="font-bold text-slate-900">Student Portal</span>
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center gap-3">
                        <button className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                            <UserCircle className="h-5 w-5" />
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    )
}
