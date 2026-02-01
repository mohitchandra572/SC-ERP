import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import { getServerTranslation } from "@/lib/i18n/server"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50/50 pb-4">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                            {t('admin.dashboard.debug')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.dashboard.email')}</p>
                            <p className="text-sm font-semibold text-slate-900">{session.user?.email}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.dashboard.roles')}</p>
                            <div className="flex flex-wrap gap-1">
                                {(session.user as any).roles?.map((role: any) => (
                                    <Badge key={role.roleId} variant="secondary" className="px-2 py-0 h-5 font-medium">{role.role.displayName}</Badge>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.dashboard.permissions')}</p>
                            <div className="flex flex-wrap gap-1">
                                {(session.user as any).permissions?.slice(0, 5).map((perm: string) => (
                                    <Badge key={perm} variant="outline" className="px-2 py-0 h-5 text-[10px] font-mono">{perm}</Badge>
                                ))}
                                {(session.user as any).permissions?.length > 5 && (
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        +{(session.user as any).permissions.length - 5} more
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageShell>
    )
}






