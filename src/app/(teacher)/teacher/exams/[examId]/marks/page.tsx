import { auth } from "@/lib/auth/auth"
import { getServerTranslation } from "@/lib/i18n/server"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { getExamMarks } from "@/features/exams/exam-actions"
import { MarksEntryTable } from "@/features/exams/components/MarksEntryTable"
import { prisma } from "@/lib/db"
import { redirect, notFound } from "next/navigation"

interface MarksEntryPageProps {
    params: {
        examId: string
    }
}

export default async function MarksEntryPage({ params }: MarksEntryPageProps) {
    const { examId } = await params
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const { t } = await getServerTranslation()

    // Fetch exam details for header
    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: {
            subject: true,
            class: true
        }
    })

    if (!exam) {
        notFound()
    }

    const studentMarks = await getExamMarks(examId)

    return (
        <PageShell>
            <PageHeader
                title={`${t('exams.marks_entry')} - ${exam.subject.name}`}
                description={`${exam.class.name} | ${new Date(exam.date).toLocaleDateString()}`}
            />

            <div className="mt-6">
                <MarksEntryTable
                    examId={examId}
                    title={t('exams.marks_entry')}
                    initialMarks={studentMarks}
                />
            </div>
        </PageShell>
    )
}
