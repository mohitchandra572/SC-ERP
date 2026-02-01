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
import { PenLine, CheckCircle2, XCircle } from "lucide-react"

export default async function TeacherExamsPage() {
    const { t } = await getServerTranslation()

    // In a real scenario, we'd filter by classes assigned to this teacher
    const exams = await prisma.exam.findMany({
        include: {
            subject: true,
            class: true,
            results: {
                take: 1 // Just to check if any results exist
            }
        },
        orderBy: { date: 'desc' }
    }) as any[]

    return (
        <PageShell>
            <PageHeader
                title={t('exams.title') || 'Exams & Results'}
                description={t('exams.list_desc') || 'View and manage scheduled exams and result status.'}
            />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="p-6 border-b bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PenLine className="h-5 w-5 text-indigo-500" />
                        <h3 className="font-bold text-slate-800 tracking-tight">{t('exams.list') || 'Upcoming Exams'}</h3>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent bg-slate-50/30">
                            <TableHead className="pl-6 text-slate-500 font-semibold">{t('exams.subject') || 'Subject'}</TableHead>
                            <TableHead className="text-slate-500 font-semibold">{t('academic.class') || 'Class'}</TableHead>
                            <TableHead className="text-slate-500 font-semibold">{t('exams.date') || 'Date'}</TableHead>
                            <TableHead className="text-slate-500 font-semibold">{t('exams.status') || 'Entry Status'}</TableHead>
                            <TableHead className="text-right pr-6 text-slate-500 font-semibold">{t('common.actions') || 'Actions'}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {exams.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="bg-slate-50 p-4 rounded-full">
                                            <PenLine className="h-8 w-8 text-slate-200" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-slate-900 font-semibold">{t('exams.no_exams') || 'No exams scheduled'}</p>
                                            <p className="text-slate-500 text-sm">{t('exams.no_exams_desc') || 'New exams will appear here once scheduled.'}</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            exams.map((exam) => (
                                <TableRow key={exam.id} className="group hover:bg-slate-50/80 transition-all duration-200 border-b border-slate-100/50">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{exam.subject.name}</span>
                                            <span className="text-xs font-medium font-mono text-slate-400">{exam.subject.code}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 px-2 py-0.5 font-semibold text-[11px]">
                                            {exam.class.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-600 font-medium py-4">
                                        {format(new Date(exam.date), 'dd MMM yyyy')}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        {exam.results.length > 0 ? (
                                            <Badge className="bg-green-50 text-green-700 border-green-100 hover:bg-green-100 border font-bold px-2.5 py-1 text-[10px] uppercase tracking-wider flex items-center w-fit gap-1.5 animate-in fade-in zoom-in duration-300">
                                                <CheckCircle2 className="h-3 w-3" />
                                                {t('exams.marks_recorded') || 'Completed'}
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100 border font-bold px-2.5 py-1 text-[10px] uppercase tracking-wider flex items-center w-fit gap-1.5">
                                                <PenLine className="h-3 w-3" />
                                                {t('exams.pending') || 'Pending'}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-6 py-4">
                                        <Button size="sm" variant="outline" asChild className="gap-2 h-8 font-semibold border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 active:scale-95 shadow-sm hover:shadow">
                                            <Link href={`/teacher/exams/${exam.id}/marks`}>
                                                <PenLine className="h-3.5 w-3.5" />
                                                {t('exams.enter_marks')}
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </PageShell>
    )
}
