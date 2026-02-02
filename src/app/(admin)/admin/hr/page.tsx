import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Users, Banknote, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getServerTranslation } from "@/lib/i18n/server"

export default async function HRPage() {
    const { t } = await getServerTranslation()

    const modules = [
        {
            title: t('admin.hr.staff'),
            description: t('admin.hr.staffDesc'),
            icon: Users,
            href: "/admin/hr/staff",
            color: "text-blue-500",
            bgColor: "bg-blue-50"
        },
        {
            title: t('admin.hr.payroll'),
            description: t('admin.hr.payrollDesc'),
            icon: Banknote,
            href: "/admin/hr/payroll",
            color: "text-emerald-500",
            bgColor: "bg-emerald-50"
        }
    ]

    return (
        <PageShell>
            <PageHeader
                title={t('admin.hr.title')}
                description={t('admin.hr.description')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((module) => (
                    <Link key={module.href} href={module.href}>
                        <Card className="h-full hover:shadow-lg transition-all border-slate-200 group cursor-pointer">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${module.bgColor} ${module.color} group-hover:scale-110 transition-transform`}>
                                    <module.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                        {module.title}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        {module.description}
                                    </CardDescription>
                                </div>
                                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </PageShell>
    )
}
