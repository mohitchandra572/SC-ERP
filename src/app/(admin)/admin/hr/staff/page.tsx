import { prisma } from "@/lib/db"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, DollarSign, Download, Edit } from "lucide-react"
import Link from "next/link"
import { getServerTranslation } from "@/lib/i18n/server"

export default async function StaffPage({ searchParams }: { searchParams: { page?: string } }) {
    const { t, locale } = await getServerTranslation()
    const page = Number(searchParams.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const [staff, total] = await Promise.all([
        prisma.staffProfile.findMany({
            include: {
                user: true,
                salaryGrade: true
            },
            take: limit,
            skip: skip,
            orderBy: { joiningDate: 'desc' }
        }),
        prisma.staffProfile.count()
    ])

    const totalPages = Math.ceil(total / limit)

    return (
        <PageShell>
            <PageHeader
                title={t('admin.hr.page.staff.title')}
                description={t('admin.hr.page.staff.description')}
            />

            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <Button variant="outline" className="gap-2" asChild>
                        <Link href="/admin/hr/payroll/grades">
                            <DollarSign className="h-4 w-4" />
                            {t('admin.hr.page.staff.salaryGrades')}
                        </Link>
                    </Button>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2" asChild>
                    <Link href="/admin/hr/staff/new">
                        <UserPlus className="h-4 w-4" />
                        {t('admin.hr.page.staff.addStaff')}
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50">
                            <TableHead className="pl-6 font-bold text-[10px] uppercase text-slate-500">{t('admin.hr.page.staff.table.name')}</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase text-slate-500">{t('admin.hr.page.staff.table.designation')}</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase text-slate-500">{t('admin.hr.page.staff.table.grade')}</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase text-slate-500">{t('admin.hr.page.staff.table.joiningDate')}</TableHead>
                            <TableHead className="font-bold text-[10px] uppercase text-slate-500">{t('admin.hr.page.staff.table.status')}</TableHead>
                            <TableHead className="text-right pr-6 font-bold text-[10px] uppercase text-slate-500">{t('admin.hr.page.staff.table.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staff.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                    {t('admin.hr.page.staff.table.noRecords')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            (staff as any[]).map((s: any) => (
                                <TableRow key={s.id} className="group hover:bg-slate-50 transition-colors">
                                    <TableCell className="pl-6 py-4">
                                        <div className="font-bold text-slate-900">{s.user.fullName}</div>
                                        <div className="text-xs text-slate-500 font-mono tracking-tighter">{s.user.email}</div>
                                    </TableCell>
                                    <TableCell className="font-black text-slate-700 text-xs tracking-tight">{s.designation}</TableCell>
                                    <TableCell>
                                        {s.salaryGrade ? (
                                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 uppercase text-[9px] font-black tracking-widest px-2 py-0.5 border-0">
                                                {s.salaryGrade.name}
                                            </Badge>
                                        ) : (
                                            <span className="text-slate-400 italic text-sm">{t('admin.hr.page.staff.table.notAssigned')}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-slate-500 font-medium text-xs">
                                        {new Date(s.joiningDate).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={s.status === 'ACTIVE' ? 'success' : 'secondary'} className="uppercase text-[9px] font-black tracking-widest px-2 py-0.5 border-0">
                                            {s.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold text-slate-400 hover:text-indigo-600 gap-1">
                                            <Edit className="h-3 w-3" />
                                            {t('admin.hr.page.staff.table.edit')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="p-4 border-t bg-slate-50/30 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium font-mono">
                        Showing <span className="text-slate-900 font-extrabold">{skip + 1}-{Math.min(skip + limit, total)}</span> of <span className="text-slate-900 font-extrabold">{total}</span>
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            className="h-7 text-[10px] font-bold tracking-tighter"
                            asChild={page > 1}
                        >
                            {page > 1 ? <Link href={`/admin/hr/staff?page=${page - 1}`}>Previous</Link> : <span>Previous</span>}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages}
                            className="h-7 text-[10px] font-bold tracking-tighter"
                            asChild={page < totalPages}
                        >
                            {page < totalPages ? <Link href={`/admin/hr/staff?page=${page + 1}`}>Next</Link> : <span>Next</span>}
                        </Button>
                    </div>
                </div>
            </div>
        </PageShell>
    )
}
