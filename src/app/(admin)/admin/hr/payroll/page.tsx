import { prisma } from "@/lib/db"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { PayrollManager } from "@/features/hr/components/PayrollManager"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { getServerTranslation } from "@/lib/i18n/server"

export default async function PayrollPage() {
    const { t, locale } = await getServerTranslation()
    const today = new Date()
    const currentMonth = today.getMonth() + 1
    const currentYear = today.getFullYear()

    const recentPayroll = await prisma.payrollRecord.findMany({
        where: { year: currentYear },
        include: {
            staffProfile: {
                include: { user: true }
            }
        },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        take: 10
    })

    return (
        <PageShell>
            <PageHeader
                title={t('admin.hr.page.title')}
                description={t('admin.hr.page.description')}
            />

            <div className="space-y-8">
                <PayrollManager currentMonth={currentMonth} currentYear={currentYear} />

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b bg-slate-50/50">
                        <h3 className="font-bold text-slate-800">{t('admin.hr.page.recentDisbursements')}</h3>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-100/30">
                                <TableHead className="pl-6">{t('admin.hr.page.table.staffMember')}</TableHead>
                                <TableHead>{t('admin.hr.page.table.period')}</TableHead>
                                <TableHead>{t('admin.hr.page.table.netPaid')}</TableHead>
                                <TableHead>{t('admin.hr.page.table.date')}</TableHead>
                                <TableHead>{t('admin.hr.page.table.status')}</TableHead>
                                <TableHead className="text-right pr-6">{t('admin.hr.page.table.receipt')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentPayroll.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                        {t('admin.hr.page.table.noRecords')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                recentPayroll.map((p: any) => (
                                    <TableRow key={p.id} className="group hover:bg-slate-50">
                                        <TableCell className="pl-6 py-4">
                                            <div className="font-bold text-slate-900">{p.staffProfile.user.fullName}</div>
                                            <div className="text-xs text-slate-500">{p.staffProfile.designation}</div>
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-600">
                                            {format(new Date(p.year, p.month - 1), 'MMMM yyyy')}
                                        </TableCell>
                                        <TableCell className="font-bold text-indigo-700">
                                            {p.netPaid.toLocaleString()} BDT
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            {p.paymentDate ? format(new Date(p.paymentDate), 'dd MMM yyyy') : '---'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={p.status === 'PAID' ? 'success' : 'warning'} className="text-[10px] uppercase">
                                                {p.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button size="sm" variant="outline" className="h-8 font-semibold">{t('admin.hr.page.table.view')}</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </PageShell>
    )
}
