import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MenuEditor } from "./_components/menu-editor"
import { AuditLogs } from "./_components/audit-logs"
import { getMenuItems } from "@/lib/actions/menu-actions"
import { getRoles } from "@/lib/actions/role-actions"
import { getAuditLogs } from "@/lib/actions/customization-actions"
import { getServerTranslation } from "@/lib/i18n/server"

export default async function CustomizationPage() {
    const menuItems = await getMenuItems()
    const roles = await getRoles()
    const auditLogs = await getAuditLogs()
    const { t } = await getServerTranslation()

    return (
        <PageShell>
            <PageHeader
                title={t('admin.settings.customization.title')}
                description={t('admin.settings.customization.description')}
            />

            <Tabs defaultValue="menu" className="space-y-6">
                <TabsList className="bg-slate-100 p-1">
                    <TabsTrigger value="menu">{t('admin.settings.customization.tabs.navigation')}</TabsTrigger>
                    <TabsTrigger value="dashboard">{t('admin.settings.customization.tabs.dashboard')}</TabsTrigger>
                    <TabsTrigger value="audit">{t('admin.settings.customization.tabs.audit')}</TabsTrigger>
                </TabsList>

                <TabsContent value="menu">
                    <MenuEditor initialMenuItems={menuItems} roles={roles} />
                </TabsContent>

                <TabsContent value="dashboard">
                    <Card className="border-none shadow-sm ring-1 ring-slate-200">
                        <CardHeader>
                            <CardTitle>{t('admin.settings.customization.layoutEditor')}</CardTitle>
                            <CardDescription>{t('admin.settings.customization.description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-2xl bg-slate-50/50">
                                {t('admin.settings.customization.comingSoon')}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="audit">
                    <AuditLogs logs={auditLogs} />
                </TabsContent>
            </Tabs>
        </PageShell>
    )
}
