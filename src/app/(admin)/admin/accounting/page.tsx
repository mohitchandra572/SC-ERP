import { auth } from "@/lib/auth/auth"
import { getServerTranslation } from "@/lib/i18n/server"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { prisma } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import Link from "next/link"
import { Receipt } from "lucide-react"

export default async function AdminFeesPage() {
    const { t } = await getServerTranslation()

    // Fetch recent pending student fees
    const fees = await prisma.studentFee.findMany({
        where: {
            status: { in: ['UNPAID', 'PARTIAL'] }
        },
        include: {
            student: true,
            feeHead: true
        },
        orderBy: { dueDate: 'asc' },
        take: 20
    })

    return (
        <PageShell>
            <PageHeader
                title={t('fees.title') || 'Fees & Accounting'}
                description={t('fees.admin_desc') || 'Manage student fees, collect payments, and view financial reports.'}
                actions={
                    <Button asChild>
                        <Link href="/admin/accounting/allocate">
                            {t('fees.allocate') || 'Allocate Fees'}
                        </Link>
                    </Button>
                }
            />

            <div className="grid gap-6">
                {/* Statistics Overview could go here if needed, but keeping it simple as requested */}

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="p-6 border-b bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-indigo-500" />
                            <h3 className="font-bold text-slate-800 tracking-tight">{t('fees.pending_dues') || 'Recent Pending Dues'}</h3>
                        </div>
                        <Badge variant="outline" className="bg-white text-indigo-600 border-indigo-100 font-semibold px-2.5 py-0.5">
                            {fees.length} {t('fees.pending_dues')}
                        </Badge>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent bg-slate-50/30">
                                <TableHead className="pl-6 text-slate-500 font-semibold">{t('student.name') || 'Student'}</TableHead>
                                <TableHead className="text-slate-500 font-semibold">{t('fees.head') || 'Fee Head'}</TableHead>
                                <TableHead className="text-slate-500 font-semibold">{t('fees.due_date') || 'Due Date'}</TableHead>
                                <TableHead className="text-slate-500 font-semibold">{t('fees.amount') || 'Amount'}</TableHead>
                                <TableHead className="text-slate-500 font-semibold">{t('fees.status') || 'Status'}</TableHead>
                                <TableHead className="text-right pr-6 text-slate-500 font-semibold">{t('common.actions') || 'Actions'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="bg-slate-100 p-4 rounded-full">
                                                <Receipt className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-slate-900 font-semibold">{t('fees.no_pending') || 'No pending fees'}</p>
                                                <p className="text-slate-500 text-sm max-w-[250px] mx-auto">All cleared! Check back later for new allocations.</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                fees.map((fee) => (
                                    <TableRow key={fee.id} className="group hover:bg-slate-50/80 transition-all duration-200 border-b border-slate-100/50">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{fee.student.fullName}</span>
                                                <span className="text-xs font-medium text-slate-400">{(fee.student as any).email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="text-slate-600 font-medium">{fee.feeHead.name}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <span>{format(new Date(fee.dueDate), 'dd MMM yyyy')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="font-bold text-indigo-700 bg-indigo-50/50 px-2 py-1 rounded text-sm tracking-tight transition-all group-hover:bg-indigo-50">
                                                {fee.amount.toLocaleString()} BDT
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {fee.status === 'UNPAID' ? (
                                                <Badge className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 border font-bold px-2.5 py-1 text-[10px] uppercase tracking-wider">
                                                    {t('fees.status_unpaid')}
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 border font-bold px-2.5 py-1 text-[10px] uppercase tracking-wider">
                                                    {t('fees.status_partial')}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-6 py-4">
                                            <Button size="sm" variant="outline" className="gap-2 h-8 font-semibold border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200">
                                                <Receipt className="h-3.5 w-3.5" />
                                                {t('fees.collect') || 'Collect'}
                                            </Button>
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
