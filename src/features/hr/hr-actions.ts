"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { auditService } from "@/lib/audit/audit-service"
import { revalidatePath } from "next/cache"

export async function createSalaryGrade(data: {
    name: string
    baseSalary: number
    housing?: number
    medical?: number
    transport?: number
    otherAllow?: number
}) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        const grade = await prisma.salaryGrade.create({
            data: {
                name: data.name,
                baseSalary: data.baseSalary,
                housing: data.housing || 0,
                medical: data.medical || 0,
                transport: data.transport || 0,
                otherAllow: data.otherAllow || 0,
            }
        })

        await auditService.logMutation('CREATE_SALARY_GRADE', 'SalaryGrade', null, grade)
        revalidatePath('/admin/hr/payroll')
        return { success: true, data: grade }
    } catch (error) {
        console.error("Failed to create salary grade:", error)
        return { success: false, error: "Failed to create salary grade" }
    }
}

export async function updateStaffProfile(userId: string, data: {
    salaryGradeId: string
    designation: string
    joiningDate: Date
    status: 'ACTIVE' | 'INACTIVE' | 'RESIGNED' | 'TERMINATED'
}) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const before = await prisma.staffProfile.findUnique({ where: { userId } })

    try {
        const staff = await prisma.staffProfile.upsert({
            where: { userId },
            create: {
                userId,
                salaryGradeId: data.salaryGradeId,
                designation: data.designation,
                joiningDate: data.joiningDate,
                status: data.status,
            },
            update: {
                salaryGradeId: data.salaryGradeId,
                designation: data.designation,
                joiningDate: data.joiningDate,
                status: data.status,
            }
        })

        await auditService.logMutation('UPDATE_STAFF_PROFILE', 'StaffProfile', before, staff)
        revalidatePath('/admin/hr/staff')
        return { success: true, data: staff }
    } catch (error) {
        console.error("Failed to update staff profile:", error)
        return { success: false, error: "Failed to update staff profile" }
    }
}

export async function processPayroll(month: number, year: number) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    try {
        const staffList = await prisma.staffProfile.findMany({
            where: { status: 'ACTIVE' },
            include: { salaryGrade: true }
        })

        const results = []
        for (const staff of staffList) {
            if (!staff.salaryGrade) continue

            const totalAllowances =
                staff.salaryGrade.housing +
                staff.salaryGrade.medical +
                staff.salaryGrade.transport +
                staff.salaryGrade.otherAllow

            const netPaid = staff.salaryGrade.baseSalary + totalAllowances

            const record = await prisma.payrollRecord.upsert({
                where: {
                    staffProfileId_month_year: {
                        staffProfileId: staff.id,
                        month,
                        year
                    }
                },
                create: {
                    staffProfileId: staff.id,
                    month,
                    year,
                    basePaid: staff.salaryGrade.baseSalary,
                    allowancePaid: totalAllowances,
                    netPaid,
                    status: 'PAID', // In real system, this would be PENDING until payment gateway confirms
                    paymentDate: new Date()
                },
                update: {
                    basePaid: staff.salaryGrade.baseSalary,
                    allowancePaid: totalAllowances,
                    netPaid,
                    status: 'PAID',
                    paymentDate: new Date()
                }
            })
            results.push(record)
        }

        await auditService.log('PROCESS_PAYROLL', 'Payroll', { month, year, count: results.length })
        revalidatePath('/admin/hr/payroll')
        return { success: true, count: results.length }
    } catch (error) {
        console.error("Payroll processing failed:", error)
        return { success: false, error: "Payroll processing failed" }
    }
}
