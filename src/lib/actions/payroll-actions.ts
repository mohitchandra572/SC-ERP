"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"
import { revalidatePath } from "next/cache"
import { auditService } from "@/lib/audit/audit-service"
import { SalaryComponentType, PayrollStatus } from "@prisma/client"

/**
 * Manage Salary Components
 */
export async function createSalaryComponent(data: {
    name: string,
    type: SalaryComponentType,
    isFixed: boolean,
    description?: string
}) {
    const session = await auth()
    if (!hasPermission(session, 'payroll.manage')) throw new Error("Unauthorized")

    const component = await prisma.salaryComponent.create({
        data
    })

    await auditService.logMutation("hr_salary_components", "CREATE", null, { id: component.id, name: component.name })
    return { success: true, id: component.id }
}

export async function getSalaryComponents() {
    const session = await auth()
    if (!hasPermission(session, 'payroll.manage')) throw new Error("Unauthorized")

    return await prisma.salaryComponent.findMany()
}

/**
 * Manage Salary Structures
 */
export async function createSalaryStructure(name: string, components: { componentId: string, amount: number }[]) {
    const session = await auth()
    if (!hasPermission(session, 'payroll.manage')) throw new Error("Unauthorized")

    const structure = await prisma.salaryStructure.create({
        data: {
            name,
            components: {
                create: components.map(c => ({
                    componentId: c.componentId,
                    amount: c.amount
                }))
            }
        }
    })

    await auditService.logMutation("hr_salary_structures", "CREATE", null, { id: structure.id, name })
    return { success: true, id: structure.id }
}

/**
 * Monthly Payroll Process
 */
export async function generateMonthlyPayroll(month: number, year: number) {
    const session = await auth()
    if (!hasPermission(session, 'payroll.run')) throw new Error("Unauthorized")

    // Check if run already exists
    const existingRun = await prisma.payrollRun.findUnique({
        where: { month_year: { month, year } }
    })

    if (existingRun && existingRun.status === 'PAID') {
        throw new Error("Payroll for this month is already approved and locked.")
    }

    const staffWithStructure = await prisma.staffProfile.findMany({
        where: {
            status: 'ACTIVE',
            salaryStructureId: { not: null }
        },
        include: {
            salaryStructure: {
                include: {
                    components: {
                        include: { component: true }
                    }
                }
            }
        }
    })

    if (staffWithStructure.length === 0) throw new Error("No active staff with salary structures found.")

    const payrollRun = await prisma.payrollRun.upsert({
        where: { month_year: { month, year } },
        update: { status: 'PROCESSING', processedById: session!.user!.id! },
        create: {
            month,
            year,
            status: 'PROCESSING',
            processedById: session!.user!.id!
        }
    })

    // Clear existing payslips for this run if re-generating
    await prisma.payslip.deleteMany({
        where: { payrollRunId: payrollRun.id, status: 'PENDING' }
    })

    let totalGross = 0
    let totalDeductions = 0
    let totalNet = 0

    for (const staff of staffWithStructure) {
        let staffGross = 0
        let staffDeductions = 0
        const componentsToCreate: any[] = []

        // Calculate based on structure
        // Simple Logic: Sum components. If percentage, it's % of 'Basic' or sum of fixed earnings.
        // For now, we use the 'amount' in StructureComponent directly (scoped implementation).

        for (const sc of staff.salaryStructure!.components) {
            const amount = sc.amount
            if (sc.component.type === 'EARNING') {
                staffGross += amount
            } else {
                staffDeductions += amount
            }

            componentsToCreate.push({
                componentId: sc.componentId,
                name: sc.component.name,
                amount: amount,
                type: sc.component.type
            })
        }

        const staffNet = staffGross - staffDeductions

        await prisma.payslip.create({
            data: {
                payrollRunId: payrollRun.id,
                staffProfileId: staff.id,
                grossAmount: staffGross,
                netAmount: staffNet,
                status: 'PENDING',
                components: {
                    create: componentsToCreate
                }
            }
        })

        totalGross += staffGross
        totalDeductions += staffDeductions
        totalNet += staffNet
    }

    // Update totals
    await prisma.payrollRun.update({
        where: { id: payrollRun.id },
        data: {
            totalGross,
            totalDeductions,
            totalNet,
            status: 'PENDING' // Set back to pending for approval
        }
    })

    await auditService.logMutation("hr_payroll_runs", "GENERATE", null, { month, year, count: staffWithStructure.length })
    revalidatePath("/admin/payroll")

    return { success: true, id: payrollRun.id }
}

/**
 * Approve & Lock Payroll
 */
export async function approvePayrollRun(payrollRunId: string) {
    const session = await auth()
    if (!hasPermission(session, 'payroll.approve')) throw new Error("Unauthorized")

    const run = await prisma.payrollRun.findUnique({
        where: { id: payrollRunId },
        include: { payslips: true }
    })

    if (!run) throw new Error("Payroll run not found")
    if (run.status === 'PAID') throw new Error("Already paid/approved")

    await prisma.$transaction([
        prisma.payrollRun.update({
            where: { id: payrollRunId },
            data: { status: 'PAID' }
        }),
        prisma.payslip.updateMany({
            where: { payrollRunId },
            data: { status: 'PAID', paymentDate: new Date() }
        })
    ])

    await auditService.logMutation("hr_payroll_runs", "APPROVE", run, { ...run, status: 'PAID' })
    revalidatePath("/admin/payroll")

    return { success: true }
}

/**
 * View Actions
 */
export async function getPayrollRuns() {
    const session = await auth()
    if (!hasPermission(session, 'payroll.run')) throw new Error("Unauthorized")

    return await prisma.payrollRun.findMany({
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        include: { processedBy: { select: { fullName: true } } }
    })
}

export async function getPayslip(payslipId: string) {
    const session = await auth()
    // Permission: payroll.export or own payslip

    const payslip = await prisma.payslip.findUnique({
        where: { id: payslipId },
        include: {
            staffProfile: { include: { user: { select: { fullName: true } }, department: true, designation: true } },
            components: true,
            payrollRun: true
        }
    })

    if (!payslip) throw new Error("Payslip not found")

    if (payslip.staffProfile.userId !== session?.user?.id && !hasPermission(session, 'payroll.export')) {
        throw new Error("Unauthorized")
    }

    return payslip
}
