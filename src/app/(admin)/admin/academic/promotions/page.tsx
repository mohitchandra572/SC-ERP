import { auth } from "@/lib/auth/auth"
import { getServerTranslation } from "@/lib/i18n/server"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { prisma } from "@/lib/db"
import { getPromotionHistory } from "@/features/academic/promotion-actions"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { TrendingUp, History, Search } from "lucide-react"
import { PromotionManager } from "@/features/academic/components/PromotionManager"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function PromotionsPage({ searchParams }: { searchParams: { classId?: string } }) {
    const { t } = await getServerTranslation()
    const { classId } = searchParams

    const classes = await prisma.class.findMany({ orderBy: { name: 'asc' } })
    const history = await getPromotionHistory()

    let students: any[] = []
    if (classId) {
        students = await prisma.userProfile.findMany({
            where: { classId },
            include: {
                user: {
                    include: {
                        studentFees: {
                            where: { status: { in: ['UNPAID', 'PARTIAL'] } }
                        }
                    }
                }
            }
        })
    }

    const formattedStudents = students.map(s => ({
        id: s.userId,
        fullName: s.user.fullName,
        rollNo: s.rollNo,
        hasPendingFees: s.user.studentFees.length > 0
    }))

    return (
        <PageShell>
            <PageHeader
                title={t('promotion.title') || 'Student Promotions'}
                description={t('promotion.desc') || 'Manage and track student movements between academic classes.'}
            />

            <div className="grid gap-8">
                {/* Promotion Action Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                            <Search className="h-5 w-5 text-indigo-500" />
                            {t('promotion.from_class')}
                        </div>
                        <div className="flex items-center gap-2">
                            <form action="" className="flex gap-2">
                                <Select name="classId" defaultValue={classId}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder={t('academic.selectClass')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button type="submit" variant="secondary" className="gap-2">
                                    <Search className="h-4 w-4" />
                                    {t('common.search')}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {classId ? (
                        <PromotionManager
                            currentClassId={classId}
                            classes={classes}
                            students={formattedStudents}
                        />
                    ) : (
                        <div className="h-32 flex items-center justify-center text-slate-400 italic">
                            {t('academic.selectClass')} to start promotion.
                        </div>
                    )}
                </div>

                {/* History Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-2 font-semibold text-slate-800">
                        <History className="h-5 w-5 text-indigo-500" />
                        {t('promotion.history_title')}
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent bg-slate-50/50">
                                <TableHead className="pl-6">{t('promotion.table.student')}</TableHead>
                                <TableHead>{t('promotion.table.from')}</TableHead>
                                <TableHead>{t('promotion.table.to')}</TableHead>
                                <TableHead>{t('promotion.table.year')}</TableHead>
                                <TableHead className="text-right pr-6">{t('promotion.table.date')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                        {t('tables.noData')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                history.map((record) => (
                                    <TableRow key={record.id} className="group hover:bg-slate-50 transition-colors">
                                        <TableCell className="pl-6">
                                            <div className="font-medium text-slate-900">{record.student.fullName}</div>
                                            <div className="text-xs text-slate-500">{(record.student as any).email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-slate-200 text-slate-500">
                                                {record.fromClass.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-none px-2 py-0.5">
                                                {record.toClass.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-600 font-medium">
                                            {record.academicYear}
                                        </TableCell>
                                        <TableCell className="text-right pr-6 text-slate-400 text-sm">
                                            {format(new Date(record.createdAt), 'dd MMM yyyy')}
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
