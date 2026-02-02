import { auth } from "@/lib/auth/auth"
import { getServerTranslation } from "@/lib/i18n/server"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { prisma } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { redirect } from "next/navigation"

export default async function StudentResultsPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const { t } = await getServerTranslation()

    // Fetch published results for this student
    const results = await prisma.result.findMany({
        where: {
            studentId: session.user.id,
            published: true
        },
        include: {
            exam: {
                include: {
                    subject: true
                }
            }
        },
        orderBy: {
            exam: {
                date: 'desc'
            }
        }
    })

    const gpa = results.length > 0
        ? (results.reduce((acc, r) => acc + r.marksObtained, 0) / results.length).toFixed(1)
        : '0.0'

    return (
        <PageShell>
            <PageHeader
                title={t('exams.results_title') || 'My Academic Results'}
                description={t('exams.student_results_desc') || 'View your performance across all subjects and examinations.'}
            />

            <div className="grid gap-6">
                {/* Summary Card */}
                <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-xl shadow-indigo-200">
                    <CardHeader>
                        <CardTitle className="text-indigo-100 font-medium text-sm uppercase tracking-wider">
                            {t('exams.average_score') || 'Average Performance Score'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-extrabold">{gpa} <span className="text-xl font-normal opacity-70">/ 100</span></div>
                        <p className="mt-4 text-indigo-100/80 text-sm font-medium">
                            {results.length > 0
                                ? `${t('exams.total_exams_viewed') || 'Based on'} ${results.length} ${t('exams.exams') || 'subjects'}`
                                : t('exams.no_results_published') || 'Waiting for results to be published.'
                            }
                        </p>
                    </CardContent>
                </Card>

                {/* Detailed Results */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent bg-slate-50/50">
                                <TableHead className="pl-6">{t('exams.subject') || 'Subject'}</TableHead>
                                <TableHead>{t('exams.exam_type') || 'Exam'}</TableHead>
                                <TableHead>{t('exams.date') || 'Date'}</TableHead>
                                <TableHead className="text-right">{t('exams.marks') || 'Marks'}</TableHead>
                                <TableHead className="text-right pr-6">{t('exams.grade') || 'Grade'}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {results.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                        {t('exams.no_results_yet') || 'No published results available yet.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                results.map((result) => (
                                    <TableRow key={result.id} className="group hover:bg-slate-50 transition-colors">
                                        <TableCell className="pl-6 font-semibold text-slate-900">
                                            {result.exam.subject.name}
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {result.exam.title || (t('exams.regular_exam') || 'Term Exam')}
                                        </TableCell>
                                        <TableCell className="text-slate-500">
                                            {format(new Date(result.exam.date), 'dd MMM yyyy')}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-slate-900">
                                            {result.marksObtained}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-3 font-bold">
                                                {result.grade || 'N/A'}
                                            </Badge>
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
