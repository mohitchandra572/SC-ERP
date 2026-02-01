'use server'

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"
import { createAuditLog } from "@/lib/actions/audit-helper"
import { revalidatePath } from "next/cache"
import { PaymentMethod, FeeStatus } from "@prisma/client"

/**
 * Fetches all available fee categories (FeeHeads).
 */
export async function getFeeHeads() {
    const session = await auth()
    if (!hasPermission(session, 'fees.view')) {
        throw new Error("Unauthorized")
    }

    return await prisma.feeHead.findMany({
        orderBy: { name: 'asc' }
    })
}

/**
 * Fetches all fee records (dues) for a specific student.
 */
export async function getStudentFees(studentId: string) {
    const session = await auth()
    if (!hasPermission(session, 'fees.view')) {
        throw new Error("Unauthorized")
    }

    return await prisma.studentFee.findMany({
        where: { studentId },
        include: { feeHead: true },
        orderBy: { dueDate: 'asc' }
    })
}

/**
 * Assigns a fee head to multiple students (bulk allocation).
 */
export async function allocateFee(studentIds: string[], feeHeadId: string, dueDate: Date) {
    const session = await auth()
    if (!hasPermission(session, 'fees.manage')) {
        throw new Error("Unauthorized")
    }

    const feeHead = await prisma.feeHead.findUnique({ where: { id: feeHeadId } })
    if (!feeHead) throw new Error("Fee head not found")

    const allocations = studentIds.map(studentId => ({
        studentId,
        feeHeadId,
        dueDate,
        amount: feeHead.amount,
        status: 'UNPAID' as FeeStatus
    }))

    await prisma.studentFee.createMany({
        data: allocations
    })

    await createAuditLog("FEE_ALLOCATION", "accounting_student_fees", { feeHeadId, studentCount: studentIds.length })
    revalidatePath("/admin/accounting")
    return { success: true }
}

/**
 * Records a payment receipt and updates the corresponding student fee status.
 */
export async function recordPayment(studentId: string, feeIds: string[], amount: number, method: PaymentMethod, txId?: string) {
    const session = await auth()
    if (!hasPermission(session, 'fees.manage')) {
        throw new Error("Unauthorized")
    }

    if (!session?.user?.id) throw new Error("Session user ID missing")

    const collectedById = session.user.id

    return await prisma.$transaction(async (tx) => {
        // 0. Fetch Before State (for auditing)
        const feesBefore = await tx.studentFee.findMany({
            where: { id: { in: feeIds } }
        })

        // 1. Create Receipt
        const receipt = await tx.feeReceipt.create({
            data: {
                studentId,
                amount,
                paymentMethod: method,
                transactionId: txId,
                collectedById
            }
        })

        // 2. Update Student Fees
        await tx.studentFee.updateMany({
            where: { id: { in: feeIds } },
            data: {
                status: 'PAID',
                paidAmount: { increment: amount / feeIds.length }
            }
        })

        // 3. Fetch After State
        const feesAfter = await tx.studentFee.findMany({
            where: { id: { in: feeIds } }
        })

        await createAuditLog(
            "FEE_PAYMENT",
            "accounting_fee_receipts",
            { receiptId: receipt.id, amount },
            {
                diff: {
                    before: feesBefore,
                    after: feesAfter
                }
            }
        )

        revalidatePath("/admin/accounting")
        return { success: true, receiptId: receipt.id }
    })
}
