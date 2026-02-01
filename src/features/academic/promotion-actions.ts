'use server'

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"
import { createAuditLog } from "@/lib/actions/audit-helper"
import { revalidatePath } from "next/cache"

/**
 * Promotes a student to a new class.
 * Checks for fees clearance before allowing promotion.
 */
export async function promoteStudent(studentId: string, toClassId: string, academicYear: string) {
    const session = await auth()
    if (!session?.user?.id || !hasPermission(session, 'promotion.manage')) {
        throw new Error("Unauthorized")
    }

    const adminId = session.user.id

    // 1. Check for fees clearance
    const pendingFees = await prisma.studentFee.findMany({
        where: {
            studentId,
            status: { in: ['UNPAID', 'PARTIAL'] }
        }
    })

    if (pendingFees.length > 0) {
        throw new Error("Student has pending dues. All fees must be cleared before promotion.")
    }

    // 2. Get current class info
    const profile = await prisma.userProfile.findUnique({
        where: { userId: studentId },
        select: { classId: true }
    })

    if (!profile || !profile.classId) {
        throw new Error("Student profile or current class not found.")
    }

    const fromClassId = profile.classId

    // 3. Update student class and record history in a transaction
    await prisma.$transaction(async (tx) => {
        // Update profile
        await tx.userProfile.update({
            where: { userId: studentId },
            data: { classId: toClassId }
        })

        // Record history
        await tx.promotionHistory.create({
            data: {
                studentId,
                fromClassId,
                toClassId,
                academicYear,
                promotedById: adminId
            }
        })
    })

    await createAuditLog("STUDENT_PROMOTION", "academic_promotions", {
        studentId,
        fromClassId,
        toClassId,
        academicYear
    })

    revalidatePath("/admin/students")
    revalidatePath("/admin/academic/promotions")

    return { success: true }
}

/**
 * Bulk promotes students from one class to another.
 */
export async function bulkPromoteStudents(studentIds: string[], toClassId: string, academicYear: string) {
    const session = await auth()
    if (!session?.user?.id || !hasPermission(session, 'promotion.manage')) {
        throw new Error("Unauthorized")
    }

    const results = await Promise.all(studentIds.map(async id => {
        try {
            await promoteStudent(id, toClassId, academicYear)
            return { id, success: true }
        } catch (error: any) {
            return { id, success: false, error: error.message }
        }
    }))

    return results
}

/**
 * Fetches promotion history for a student or class.
 */
export async function getPromotionHistory(studentId?: string) {
    const session = await auth()
    if (!hasPermission(session, 'promotion.view')) {
        throw new Error("Unauthorized")
    }

    return await prisma.promotionHistory.findMany({
        where: studentId ? { studentId } : {},
        include: {
            student: true,
            fromClass: true,
            toClass: true,
            promotedBy: true
        },
        orderBy: { createdAt: 'desc' }
    })
}
