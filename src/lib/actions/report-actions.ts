"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { auditService } from "@/lib/audit/audit-service"
import { exportEngine } from "@/lib/exports/export-engine"
import { createAuditLog } from "@/lib/actions/audit-helper"
import { hasPermission } from "@/lib/rbac/rbac"
import { revalidatePath } from "next/cache"
import { AttendanceStatus, FeeStatus, PaymentMethod } from "@prisma/client"
import { format as formatDate } from "date-fns"

export async function exportStudents() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const students = await prisma.user.findMany({
        where: { profile: { isNot: null } },
        include: {
            profile: { include: { class: true } }
        }
    })

    const columns = [
        { header: 'Full Name', key: (s: any) => s.fullName },
        { header: 'Email', key: (s: any) => s.email },
        { header: 'Class', key: (s: any) => s.profile?.class?.name || 'N/A' },
        { header: 'Roll No', key: (s: any) => s.profile?.rollNo || 'N/A' },
        { header: 'Joined At', key: (s: any) => s.createdAt.toISOString() }
    ]

    const csv = await exportEngine.toCSV(students, columns, 'Students')

    await createAuditLog(
        "STUDENT_EXPORT",
        "academic_students",
        { count: students.length },
        null,
        'EXPORT'
    )

    return csv
}

export async function exportFees() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const fees = await prisma.studentFee.findMany({
        include: {
            student: true,
            feeHead: true
        }
    })

    const columns = [
        { header: 'Student', key: (f: any) => f.student.fullName },
        { header: 'Fee Head', key: (f: any) => f.feeHead.name },
        { header: 'Amount', key: (f: any) => f.amount },
        { header: 'Paid', key: (f: any) => f.paidAmount },
        { header: 'Status', key: (f: any) => f.status },
        { header: 'Due Date', key: (f: any) => f.dueDate.toISOString() }
    ]

    const csv = await exportEngine.toCSV(fees, columns, 'Fees')

    await createAuditLog(
        "FEE_EXPORT",
        "accounting_fees",
        { count: fees.length },
        null,
        'EXPORT'
    )

    return csv
}

// --- Enterprise Reporting Phase 2 ---

async function getBranding() {
    const settings = await prisma.schoolSettings.findFirst()
    if (!settings) return undefined
    return {
        schoolName: settings.schoolNameBn,
        address: settings.addressBn,
        phone: settings.phone,
        email: settings.email,
        eiin: settings.eiin || undefined,
        logoUrl: settings.logoUrl || undefined
    }
}

/**
 * Exports attendance summary for a class on a specific date.
 */
export async function exportAttendanceReport(format: 'CSV' | 'PDF', classId: string, date: Date) {
    const session = await auth()
    if (!hasPermission(session, 'reports.view')) throw new Error("Unauthorized")
    if (format === 'CSV' && !hasPermission(session, 'export.csv')) throw new Error("Unauthorized")
    if (format === 'PDF' && !hasPermission(session, 'export.pdf')) throw new Error("Unauthorized")

    const cls = await prisma.class.findUnique({ where: { id: classId } })
    const attendances = await prisma.attendance.findMany({
        where: { classId, date: { equals: date } },
        include: { student: true },
        orderBy: { student: { fullName: 'asc' } }
    })

    const title = `Attendance Report - ${cls?.name || 'N/A'} - ${formatDate(date, 'yyyy-MM-dd')}`
    const columns = [
        { header: 'Student Name', key: (a: any) => a.student.fullName },
        { header: 'Status', key: (a: any) => a.status },
        { header: 'Recorded At', key: (a: any) => formatDate(a.createdAt, 'HH:mm:ss') }
    ]

    if (format === 'CSV') {
        return await exportEngine.toCSV(attendances, columns, 'academic_attendances')
    } else {
        const branding = await getBranding()
        return await exportEngine.toPDF(attendances, columns, title, 'academic_attendances', branding)
    }
}

/**
 * Exports comprehensive list of pending fees.
 */
export async function exportFeesDueReport(format: 'CSV' | 'PDF', classId?: string) {
    const session = await auth()
    if (!hasPermission(session, 'reports.view')) throw new Error("Unauthorized")

    const where: any = { status: { in: ['UNPAID', 'PARTIAL'] } }
    if (classId) where.student = { profile: { classId } }

    const dues = await prisma.studentFee.findMany({
        where,
        include: { student: { include: { profile: { include: { class: true } } } }, feeHead: true },
        orderBy: { dueDate: 'asc' }
    })

    const title = `Outstanding Fees Report ${classId ? `- Class: ${classId}` : ''}`
    const columns = [
        { header: 'Student', key: (d: any) => d.student.fullName },
        { header: 'Class', key: (d: any) => d.student.profile?.class?.name || 'N/A' },
        { header: 'Fee Head', key: (d: any) => d.feeHead.name },
        { header: 'Due Amount', key: (d: any) => d.amount - d.paidAmount },
        { header: 'Due Date', key: (d: any) => formatDate(d.dueDate, 'yyyy-MM-dd') }
    ]

    if (format === 'CSV') {
        return await exportEngine.toCSV(dues, columns, 'accounting_student_fees')
    } else {
        const branding = await getBranding()
        return await exportEngine.toPDF(dues, columns, title, 'accounting_student_fees', branding)
    }
}

/**
 * Exports payment ledger for a specific period.
 */
export async function exportPaymentLedger(format: 'CSV' | 'PDF', startDate: Date, endDate: Date) {
    const session = await auth()
    if (!hasPermission(session, 'reports.view')) throw new Error("Unauthorized")

    const receipts = await prisma.feeReceipt.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        include: { student: true, collectedBy: true },
        orderBy: { createdAt: 'desc' }
    })

    const title = `Payment Ledger: ${formatDate(startDate, 'yyyy-MM-dd')} to ${formatDate(endDate, 'yyyy-MM-dd')}`
    const columns = [
        { header: 'Student', key: (r: any) => r.student.fullName },
        { header: 'Amount', key: (r: any) => r.amount },
        { header: 'Method', key: (r: any) => r.paymentMethod },
        { header: 'Collected By', key: (r: any) => r.collectedBy.fullName },
        { header: 'Date', key: (r: any) => formatDate(r.createdAt, 'yyyy-MM-dd HH:mm') }
    ]

    if (format === 'CSV') {
        return await exportEngine.toCSV(receipts, columns, 'accounting_fee_receipts')
    } else {
        const branding = await getBranding()
        return await exportEngine.toPDF(receipts, columns, title, 'accounting_fee_receipts', branding)
    }
}

/**
 * Exports marks/results sheet for an exam.
 */
export async function exportMarksSheet(format: 'CSV' | 'PDF', examId: string) {
    const session = await auth()
    if (!hasPermission(session, 'reports.view')) throw new Error("Unauthorized")

    const results = await prisma.result.findMany({
        where: { examId },
        include: { student: { include: { profile: true } }, exam: { include: { subject: true, class: true } } },
        orderBy: { student: { profile: { rollNo: 'asc' } } }
    })

    const exam = results[0]?.exam
    const title = exam ? `Result Sheet: ${exam.title} - ${exam.class.name} (${exam.subject.name})` : 'Result Sheet'

    const columns = [
        { header: 'Roll', key: (r: any) => r.student.profile?.rollNo || 'N/A' },
        { header: 'Student', key: (r: any) => r.student.fullName },
        { header: 'Marks', key: (r: any) => r.marksObtained },
        { header: 'Grade', key: (r: any) => r.grade || 'N/A' }
    ]

    if (format === 'CSV') {
        return await exportEngine.toCSV(results, columns, 'academic_results')
    } else {
        const branding = await getBranding()
        return await exportEngine.toPDF(results, columns, title, 'academic_results', branding)
    }
}

/**
 * Report Presets Management
 */
export async function saveReportPreset(name: string, reportType: string, config: any) {
    const session = await auth()
    if (!session?.user?.id || !hasPermission(session, 'reports.presets.manage')) {
        throw new Error("Unauthorized")
    }

    const preset = await prisma.reportPreset.create({
        data: {
            name,
            reportType,
            config,
            userId: session.user.id
        }
    })

    await createAuditLog("REPORT_PRESET_CREATE", "ui_report_presets", { name, reportType })
    revalidatePath("/admin/reports")
    return { success: true, id: preset.id }
}

export async function getReportPresets(reportType?: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    return await prisma.reportPreset.findMany({
        where: {
            userId: session.user.id,
            ...(reportType ? { reportType } : {})
        },
        orderBy: { createdAt: 'desc' }
    })
}

/**
 * Individual Fee Receipt PDF
 */
export async function exportFeeReceipt(receiptId: string) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const receipt = await prisma.feeReceipt.findUnique({
        where: { id: receiptId },
        include: { student: { include: { profile: { include: { class: true } } } }, collectedBy: true }
    })

    if (!receipt) throw new Error("Receipt not found")

    // Allow student to see their own receipt, or staff/admin with reports.view
    if (receipt.studentId !== session.user?.id && !hasPermission(session, 'reports.view')) {
        throw new Error("Unauthorized")
    }

    const title = `Fee Receipt - #${receipt.id.slice(0, 8)}`
    const columns = [
        { header: 'Detail', key: (k: any) => k.label },
        { header: 'Value', key: (v: any) => v.value }
    ]

    const data = [
        { label: 'Date', value: formatDate(receipt.createdAt, 'yyyy-MM-dd HH:mm') },
        { label: 'Student', value: receipt.student.fullName },
        { label: 'Class', value: receipt.student.profile?.class?.name || 'N/A' },
        { label: 'Amount', value: `${receipt.amount} BDT` },
        { label: 'Method', value: receipt.paymentMethod },
        { label: 'Transaction ID', value: receipt.transactionId || 'N/A' },
        { label: 'Collected By', value: receipt.collectedBy.fullName }
    ]

    const branding = await getBranding()
    return await exportEngine.toPDF(data, columns, title, 'accounting_fee_receipts', branding)
}

/**
 * Individual Student Result Card PDF
 */
export async function exportStudentResult(studentId: string, examId: string) {
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    // Allow student to see their own result, or staff/admin with reports.view
    if (studentId !== session.user?.id && !hasPermission(session, 'reports.view')) {
        throw new Error("Unauthorized")
    }

    const result = await prisma.result.findUnique({
        where: { examId_studentId: { examId, studentId } },
        include: { student: { include: { profile: { include: { class: true } } } }, exam: { include: { subject: true } } }
    })

    if (!result) throw new Error("Result not found")

    const title = `Academic Result Card - ${result.exam.title}`
    const columns = [
        { header: 'Metric', key: (m: any) => m.label },
        { header: 'Value', key: (v: any) => v.value }
    ]

    const data = [
        { label: 'Student', value: result.student.fullName },
        { label: 'Roll No', value: result.student.profile?.rollNo || 'N/A' },
        { label: 'Class', value: result.student.profile?.class?.name || 'N/A' },
        { label: 'Subject', value: result.exam.subject.name },
        { label: 'Marks', value: result.marksObtained },
        { label: 'Grade', value: result.grade || 'N/A' },
        { label: 'Status', value: result.published ? 'Published' : 'Draft' }
    ]

    const branding = await getBranding()
    return await exportEngine.toPDF(data, columns, title, 'academic_results', branding)
}
