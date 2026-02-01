'use server'

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"
import { createAuditLog } from "@/lib/actions/audit-helper"
import { notificationService } from "@/lib/notifications/notification-service"
import { revalidatePath } from "next/cache"
import { AttendanceStatus } from "@prisma/client"

/**
 * Fetches the student list for a specific class and date, including existing attendance status.
 */
export async function getAttendanceList(classId: string, date: Date) {
    const session = await auth()
    if (!hasPermission(session, 'attendance.view')) {
        throw new Error("Unauthorized")
    }

    // Get students in the class
    const students = await prisma.user.findMany({
        where: {
            profile: { classId },
            roles: { some: { role: { name: 'STUDENT' } } }
        },
        include: {
            profile: true,
            attendances: {
                where: { classId, date: { equals: date } }
            }
        },
        orderBy: { profile: { rollNo: 'asc' } }
    })

    return students.map(s => ({
        id: s.id,
        fullName: s.fullName,
        rollNo: s.profile?.rollNo,
        status: s.attendances[0]?.status || null
    }))
}

/**
 * Saves or updates attendance records for a class on a specific date.
 * Triggers automated SMS/Notifications for absent students.
 */
export async function saveAttendance(classId: string, date: Date, records: { studentId: string, status: AttendanceStatus }[]) {
    const session = await auth()
    if (!hasPermission(session, 'attendance.take')) {
        throw new Error("Unauthorized")
    }

    if (!session?.user?.id) throw new Error("Session user ID missing")

    const recordedById = session.user.id

    await prisma.$transaction(
        records.map(r => prisma.attendance.upsert({
            where: {
                studentId_classId_date: {
                    studentId: r.studentId,
                    classId,
                    date
                }
            },
            update: { status: r.status, recordedById },
            create: {
                studentId: r.studentId,
                classId,
                date,
                status: r.status,
                recordedById
            }
        }))
    )

    // Audit Log
    await createAuditLog("ATTENDANCE_TAKE", "academic_attendances", { classId, date, count: records.length })

    // Automated Messaging for Absent Students
    const absentStudents = records.filter(r => r.status === 'ABSENT')
    for (const record of absentStudents) {
        const student = await prisma.user.findUnique({
            where: { id: record.studentId },
            include: { profile: true }
        })

        if (student?.profile?.phone) {
            await notificationService.queueSms(
                student.profile.phone,
                `Urgent: ${student.fullName} is ABSENT today (${date.toLocaleDateString()}). Please contact the school.`
            )
        }
    }

    revalidatePath("/teacher/attendance")
    return { success: true }
}
