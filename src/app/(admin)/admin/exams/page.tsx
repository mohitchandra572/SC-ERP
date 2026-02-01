import { auth } from "@/lib/auth/auth"
import { getServerTranslation } from "@/lib/i18n/server"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { prisma } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { toggleResultPublication } from "@/features/exams/exam-actions"
import { CheckCircle2, XCircle, Eye, Megaphone, MegaphoneOff } from "lucide-react"

export default async function AdminExamsPage() {
    const { t } = await getServerTranslation()

    const exams = await prisma.exam.findMany({
        include: {
            subject: true,
            class: true,
            results: {
                take: 1
            }
        },
        orderBy: { date: 'desc' }
    })

    return (
        <PageShell>
            <PageHeader
                title={t('exams.title') || 'Exams & Results Management'}
                description={t('exams.admin_desc') || 'Manage exam schedules and control result publication to students and parents.'}
            />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent bg-slate-50/50">
                            <TableHead className="pl-6">{t('exams.subject') || 'Subject'}</TableHead>
                            <TableHead>{t('academic.class') || 'Class'}</TableHead>
                            <TableHead>{t('exams.date') || 'Date'}</TableHead>
                            <TableHead>{t('exams.status') || 'Status'}</TableHead>
                            <TableHead className="text-right pr-6">{t('common.actions') || 'Actions'}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {exams.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                    {t('exams.no_exams') || 'No exams configured.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            exams.map((exam) => {
                                const isPublished = (exam as any).results?.[0]?.published ?? false;
                                return (
                                    <TableRow key={exam.id} className="group hover:bg-slate-50 transition-colors">
                                        <TableCell className="pl-6 font-medium text-slate-900">
                                            {exam.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-slate-200 text-slate-600">
                                                {(exam as any).class?.name || (exam as any).classId}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-500">
                                            {format(new Date((exam as any).date || exam.createdAt), 'dd MMM yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            {isPublished ? (
                                                <Badge variant="success" className="gap-1 px-2 py-0.5">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    {t('exams.published')}
                                                </Badge>
                                            ) : (
                                                <Badge variant="warning" className="gap-1 px-2 py-0.5">
                                                    <XCircle className="h-3 w-3" />
                                                    {t('exams.not_published')}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <form action={async () => {
                                                    'use server'
                                                    await toggleResultPublication(exam.id, !isPublished)
                                                }}>
                                                    <Button
                                                        size="sm"
                                                        variant={isPublished ? "outline" : "default"}
                                                        className="gap-2"
                                                    >
                                                        {isPublished ? (
                                                            <>
                                                                <MegaphoneOff className="h-4 w-4" />
                                                                {t('exams.unpublish')}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Megaphone className="h-4 w-4" />
                                                                {t('exams.publish')}
                                                            </>
                                                        )}
                                                    </Button>
                                                </form>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </PageShell>
    )
}
