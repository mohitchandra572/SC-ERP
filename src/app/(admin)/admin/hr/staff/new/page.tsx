import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Construction } from "lucide-react"
import { getServerTranslation } from "@/lib/i18n/server"

export default async function NewStaffPage() {
    const { t } = await getServerTranslation()

    return (
        <PageShell>
            <PageHeader
                title={t('admin.hr.page.staff.addStaff')}
                description={t('admin.hr.page.staff.description')}
            />

            <Card className="border-dashed border-2 border-slate-300 shadow-none">
                <CardContent className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                    <div className="bg-amber-100 p-4 rounded-full">
                        <Construction className="h-8 w-8 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-800">Module Under Construction</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            The comprehensive staff registration form is currently being verified.
                            Please contact system support for manual staff entry.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </PageShell>
    )
}
