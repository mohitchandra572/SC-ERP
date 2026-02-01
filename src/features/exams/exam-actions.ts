'use server'

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"
import { createAuditLog } from "@/lib/actions/audit-helper"
import { revalidatePath } from "next/cache"

/**
 * Fetches all exams for a specific class.
 */
export async function getExams(classId: string) {
    const session = await auth()
    if (!hasPermission(session, 'results.view')) {
        throw new Error("Unauthorized")
    }

    return await prisma.exam.findMany({
        where: { classId },
        include: { subject: true },
        orderBy: { date: 'asc' }
    })
}

/**
 * Fetches marks for all students in a specific exam.
 */
export async function getExamMarks(examId: string) {
    const session = await auth()
    if (!hasPermission(session, 'results.view')) {
        throw new Error("Unauthorized")
    }

    const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: { class: true }
    })

    if (!exam) throw new Error("Exam not found")

    const students = await prisma.user.findMany({
        where: {
            profile: { classId: exam.classId },
            roles: { some: { role: { name: 'STUDENT' } } }
        },
        include: {
            profile: true,
            results: {
                where: { examId }
            }
        },
        orderBy: { profile: { rollNo: 'asc' } }
    })

    return students.map(s => ({
        id: s.id,
        fullName: s.fullName,
        rollNo: s.profile?.rollNo ?? null,
        marksObtained: s.results[0]?.marksObtained ?? null,
        grade: s.results[0]?.grade ?? null,
        published: s.results[0]?.published ?? false
    }))
}

/**
 * Saves or updates marks for multiple students in an exam.
 */
export async function saveMarks(examId: string, marks: { studentId: string, marksObtained: number }[]) {
    const session = await auth()
    if (!hasPermission(session, 'results.enter')) {
        throw new Error("Unauthorized")
    }

    const updates = marks.map(m => prisma.result.upsert({
        where: {
            examId_studentId: {
                examId,
                studentId: m.studentId
            }
        },
        update: {
            marksObtained: m.marksObtained,
            grade: calculateGrade(m.marksObtained) // Simple mock grading
        },
        create: {
            examId,
            studentId: m.studentId,
            marksObtained: m.marksObtained,
            grade: calculateGrade(m.marksObtained)
        }
    }))

    await prisma.$transaction(updates)
    await createAuditLog("MARKS_ENTRY", "academic_results", { examId, studentCount: marks.length })

    revalidatePath("/teacher/exams")
    return { success: true }
}

/**
 * Publishes/unpublishes results for an exam.
 */
export async function toggleResultPublication(examId: string, published: boolean) {
    const session = await auth()
    if (!hasPermission(session, 'results.publish')) {
        throw new Error("Unauthorized")
    }

    await prisma.result.updateMany({
        where: { examId },
        data: { published }
    })

    await createAuditLog("RESULTS_PUBLISH", "academic_results", { examId, published })
    revalidatePath("/admin/exams")
    revalidatePath("/student/results")
    return { success: true }
}

function calculateGrade(marks: number): string {
    if (marks >= 80) return 'A+'
    if (marks >= 70) return 'A'
    if (marks >= 60) return 'A-'
    if (marks >= 50) return 'B'
    if (marks >= 40) return 'C'
    if (marks >= 33) return 'D'
    return 'F'
}
