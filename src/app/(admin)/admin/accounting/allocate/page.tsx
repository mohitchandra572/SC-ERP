import { auth } from "@/lib/auth/auth"
import { getServerTranslation } from "@/lib/i18n/server"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectItem } from "@/components/ui/select"
import { allocateFee } from "@/features/fees/fees-actions"
import { redirect } from "next/navigation"

export default async function FeesAllocationPage() {
    const { t } = await getServerTranslation()

    const feeHeads = await prisma.feeHead.findMany()
    const classes = await prisma.class.findMany()

    return (
        <PageShell>
            <PageHeader
                title={t('fees.allocate_title') || 'Bulk Fee Allocation'}
                description={t('fees.allocate_desc') || 'Assign fee heads to all students in a specific class or individually.'}
            />

            <div className="max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <form action={async (formData) => {
                    'use server'
                    const classId = formData.get('classId') as string
                    const feeHeadId = formData.get('feeHeadId') as string
                    const dueDateStr = formData.get('dueDate') as string

                    if (!feeHeadId || !dueDateStr || !classId) return

                    const students = await prisma.user.findMany({
                        where: { profile: { classId } },
                        select: { id: true }
                    })

                    if (students.length > 0) {
                        await allocateFee(students.map(s => s.id), feeHeadId, new Date(dueDateStr))
                    }

                    redirect("/admin/accounting")
                }} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="classId">{t('academic.class') || 'Target Class'}</Label>
                        <Select name="classId" required>
                            <option value="">{t('academic.selectClass') || 'Select a class...'}</option>
                            {classes.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name} ({c.code})</SelectItem>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="feeHeadId">{t('fees.head') || 'Fee Type'}</Label>
                        <Select name="feeHeadId" required>
                            <option value="">{t('fees.select_head') || 'Select original fee head...'}</option>
                            {feeHeads.map(f => (
                                <SelectItem key={f.id} value={f.id}>{f.name} - {f.amount} BDT</SelectItem>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">{t('fees.due_date') || 'Payment Deadline'}</Label>
                        <Input type="date" name="dueDate" required className="h-11" />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="submit" className="flex-1 h-11">
                            {t('fees.confirm_allocation') || 'Allocate to Class'}
                        </Button>
                        <Button variant="outline" asChild className="h-11">
                            <Link href="/admin/accounting">{t('common.cancel') || 'Cancel'}</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </PageShell>
    )
}

import Link from "next/link"
