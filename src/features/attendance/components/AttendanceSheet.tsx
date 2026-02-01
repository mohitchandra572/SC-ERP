'use client'

import { useState, useTransition } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AttendanceStatus } from "@prisma/client"
import { saveAttendance } from "../attendance-actions"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Student {
    id: string
    fullName: string
    rollNo: string | null
    status: AttendanceStatus | null
}

interface AttendanceSheetProps {
    classId: string
    date: Date
    initialStudents: Student[]
    t: (key: string) => string
}

export function AttendanceSheet({ classId, date, initialStudents, t }: AttendanceSheetProps) {
    const [records, setRecords] = useState<Record<string, AttendanceStatus>>(
        initialStudents.reduce((acc, s) => {
            if (s.status) acc[s.id] = s.status
            return acc
        }, {} as Record<string, AttendanceStatus>)
    )
    const [isPending, startTransition] = useTransition()

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setRecords(prev => ({ ...prev, [studentId]: status }))
    }

    const handleBatchPresent = () => {
        const newRecords = { ...records }
        initialStudents.forEach(s => {
            if (!newRecords[s.id]) newRecords[s.id] = 'PRESENT'
        })
        setRecords(newRecords)
    }

    const onSave = () => {
        const formattedRecords = Object.entries(records).map(([studentId, status]) => ({
            studentId,
            status
        }))

        if (formattedRecords.length < initialStudents.length) {
            if (!confirm(t('attendance.confirm_partial'))) return
        }

        startTransition(async () => {
            try {
                const res = await saveAttendance(classId, date, formattedRecords)
                if (res.success) {
                    toast.success(t('attendance.save_success'))
                }
            } catch (error) {
                toast.error(t('attendance.save_error'))
            }
        })
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('attendance.title')} - {date.toLocaleDateString()}</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleBatchPresent}>
                        {t('attendance.mark_rest_present')}
                    </Button>
                    <Button size="sm" onClick={onSave} disabled={isPending}>
                        {isPending ? t('common.saving') : t('common.save')}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">{t('student.roll')}</TableHead>
                            <TableHead>{t('student.name')}</TableHead>
                            <TableHead className="text-right">{t('attendance.status')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialStudents.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.rollNo || '-'}</TableCell>
                                <TableCell>{student.fullName}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as AttendanceStatus[]).map((status) => (
                                            <Button
                                                key={status}
                                                size="sm"
                                                variant={records[student.id] === status ? 'default' : 'outline'}
                                                className="px-2 py-0 h-8 text-xs"
                                                onClick={() => handleStatusChange(student.id, status)}
                                            >
                                                {t(`attendance.status_${status.toLowerCase()}`)}
                                            </Button>
                                        ))}
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
