import { getClasses } from "@/features/academic/academic-actions"
import { getAttendanceList } from "@/features/attendance/attendance-actions"
import { AttendanceSheet } from "@/features/attendance/components/AttendanceSheet"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { getServerTranslation } from "@/lib/i18n/server"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function AttendancePage({
    searchParams
}: {
    searchParams: Promise<{ classId?: string; date?: string }>
}) {
    const { classId, date: dateStr } = await searchParams
    const { t } = await getServerTranslation()
    const classes = await getClasses()

    const selectedDate = dateStr ? new Date(dateStr) : new Date()
    selectedDate.setHours(0, 0, 0, 0)

    let students: any[] = []
    if (classId) {
        students = await getAttendanceList(classId, selectedDate)
    }

    return (
        <PageShell>
            <PageHeader
                title={t('attendance.title')}
                description={t('attendance.description') || 'Mark daily attendance for your students.'}
            />

            <Card className="mb-8 border-none shadow-sm bg-white/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <form className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                                {t('academic.class') || 'Select Class'}
                            </label>
                            <Select name="classId" defaultValue={classId}>
                                <option value="" disabled>{t('academic.selectClass') || 'Choose a class...'}</option>
                                {classes.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name} ({c.code})
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                                {t('common.date') || 'Date'}
                            </label>
                            <input
                                type="date"
                                name="date"
                                defaultValue={selectedDate.toISOString().split('T')[0]}
                                className="w-full h-11 px-3 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                            />
                        </div>

                        <Button type="submit" className="h-11 px-8 rounded-lg shadow-md shadow-primary/10 transition-all hover:shadow-lg hover:shadow-primary/20">
                            {t('common.search') || 'Load Sheet'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {classId ? (
                <AttendanceSheet
                    classId={classId}
                    date={selectedDate}
                    initialStudents={students}
                />
            ) : (
                <Card className="border-dashed border-2 bg-slate-50/50">
                    <CardContent className="h-40 flex items-center justify-center text-slate-400 font-medium italic">
                        {t('attendance.select_to_start') || 'Please select a class to view the attendance sheet.'}
                    </CardContent>
                </Card>
            )}
        </PageShell>
    )
}

// Minimal missing component for the form (Select is standard shadcn, but I should use a wrapper if it's not available yet)
import { Button } from "@/components/ui/button"
