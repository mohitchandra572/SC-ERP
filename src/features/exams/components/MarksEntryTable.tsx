'use client'

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { saveMarks } from "../exam-actions"
import { toast } from "sonner"
import { Save, Loader2 } from "lucide-react"

interface StudentMark {
    id: string
    fullName: string
    rollNo: string | null
    marksObtained: number | null
}

interface MarksEntryTableProps {
    examId: string
    title: string
    initialMarks: StudentMark[]
    t: (key: string) => string
}

export function MarksEntryTable({ examId, title, initialMarks, t }: MarksEntryTableProps) {
    const [marks, setMarks] = useState<Record<string, string>>(
        initialMarks.reduce((acc, s) => {
            acc[s.id] = s.marksObtained?.toString() || ""
            return acc
        }, {} as Record<string, string>)
    )
    const [isPending, startTransition] = useTransition()

    const handleMarkChange = (studentId: string, value: string) => {
        // Validate input (allow only numbers and empty string)
        if (value === "" || /^[0-9]+$/.test(value)) {
            setMarks(prev => ({ ...prev, [studentId]: value }))
        }
    }

    const onSave = () => {
        const formattedMarks = Object.entries(marks)
            .filter(([_, val]) => val !== "")
            .map(([studentId, val]) => ({
                studentId,
                marksObtained: parseInt(val)
            }))

        if (formattedMarks.length === 0) {
            toast.error(t('exams.no_marks_entered'))
            return
        }

        startTransition(async () => {
            try {
                const res = await saveMarks(examId, formattedMarks)
                if (res.success) {
                    toast.success(t('exams.save_success'))
                }
            } catch (error) {
                toast.error(t('exams.save_error'))
            }
        })
    }

    return (
        <Card className="w-full border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 p-6">
                <div>
                    <CardTitle className="text-xl font-bold text-slate-900">{title}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">{t('exams.marks_entry_desc') || 'Enter and update student marks for this exam.'}</p>
                </div>
                <Button onClick={onSave} disabled={isPending} className="gap-2 h-10 px-6">
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isPending ? t('common.saving') : t('common.save')}
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-slate-200">
                            <TableHead className="w-[100px] pl-6">{t('student.roll')}</TableHead>
                            <TableHead>{t('student.name')}</TableHead>
                            <TableHead className="w-[150px] text-right pr-6">{t('exams.marks') || 'Marks'}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialMarks.map((student) => (
                            <TableRow key={student.id} className="group hover:bg-slate-50 transition-colors">
                                <TableCell className="pl-6 font-medium text-slate-700">{student.rollNo || '-'}</TableCell>
                                <TableCell className="text-slate-900">{student.fullName}</TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex justify-end">
                                        <Input
                                            type="text"
                                            className="w-24 text-right h-10 focus:ring-primary/20"
                                            value={marks[student.id]}
                                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
