import { auth } from "@/lib/auth/auth"
import { getServerTranslation } from "@/lib/i18n/server"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { getStudentFees } from "@/features/fees/fees-actions"
import { StudentFeeCard } from "@/features/fees/components/StudentFeeCard"
import { redirect } from "next/navigation"

export default async function StudentFeesPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const { t } = await getServerTranslation()
    const studentFees = await getStudentFees(session.user.id)

    // Transform Date objects if necessary (though getStudentFees returns them from Prisma)
    const formattedFees = studentFees.map(fee => ({
        ...fee,
        dueDate: new Date(fee.dueDate)
    }))

    return (
        <PageShell>
            <PageHeader
                title={t('fees.title') || 'Fees & Accounting'}
                description={t('fees.student_desc') || 'View and manage your academic and institutional dues.'}
            />
            <div className="grid gap-6">
                <StudentFeeCard fees={formattedFees} t={t} />
            </div>
        </PageShell>
    )
}
