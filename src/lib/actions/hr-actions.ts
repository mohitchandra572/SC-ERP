"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"
import { revalidatePath } from "next/cache"
import { auditService } from "@/lib/audit/audit-service"
import { StaffStatus } from "@prisma/client"

/**
 * Manage Departments
 */
export async function createDepartment(name: string, description?: string) {
    const session = await auth()
    if (!hasPermission(session, 'hr.manage')) throw new Error("Unauthorized")

    const dept = await prisma.staffDepartment.create({
        data: { name, description }
    })

    await auditService.logMutation("hr_departments", "CREATE", null, { id: dept.id, name })
    revalidatePath("/admin/hr")
    return { success: true, id: dept.id }
}

export async function getDepartments() {
    const session = await auth()
    if (!hasPermission(session, 'hr.manage')) throw new Error("Unauthorized")

    return await prisma.staffDepartment.findMany({
        orderBy: { name: 'asc' }
    })
}

/**
 * Manage Designations
 */
export async function createDesignation(name: string, level: number = 1) {
    const session = await auth()
    if (!hasPermission(session, 'hr.manage')) throw new Error("Unauthorized")

    const designation = await prisma.staffDesignation.create({
        data: { name, level }
    })

    await auditService.logMutation("hr_designations", "CREATE", null, { id: designation.id, name })
    revalidatePath("/admin/hr")
    return { success: true, id: designation.id }
}

export async function getDesignations() {
    const session = await auth()
    if (!hasPermission(session, 'hr.manage')) throw new Error("Unauthorized")

    return await prisma.staffDesignation.findMany({
        orderBy: { level: 'asc' }
    })
}

/**
 * Staff Onboarding & Profile Management
 */
export async function updateStaffOnboarding(staffId: string, data: {
    departmentId?: string,
    designationId?: string,
    joiningDate: Date,
    status: StaffStatus
}) {
    const session = await auth()
    if (!hasPermission(session, 'hr.manage')) throw new Error("Unauthorized")

    const updated = await prisma.staffProfile.update({
        where: { id: staffId },
        data: {
            departmentId: data.departmentId,
            designationId: data.designationId,
            joiningDate: data.joiningDate,
            status: data.status
        }
    })

    await auditService.logMutation("hr_staff_profiles", "UPDATE", null, { id: staffId, changes: data }) // 'before' state not easily available here
    revalidatePath("/admin/hr/staff")
    return { success: true }
}

export async function getStaffProfiles() {
    const session = await auth()
    if (!hasPermission(session, 'hr.manage')) throw new Error("Unauthorized")

    return await prisma.staffProfile.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            },
            department: true,
            designation: true,
            salaryStructure: true
        },
        orderBy: { joiningDate: 'desc' }
    })
}

/**
 * HR Stats for Dashboard
 */
export async function getHRStats() {
    const session = await auth()
    if (!hasPermission(session, 'hr.manage')) throw new Error("Unauthorized")

    const [totalStaff, deptCounts, statusCounts] = await Promise.all([
        prisma.staffProfile.count(),
        prisma.staffProfile.groupBy({
            by: ['departmentId'],
            _count: true
        }),
        prisma.staffProfile.groupBy({
            by: ['status'],
            _count: true
        })
    ])

    return {
        totalStaff,
        deptCounts,
        statusCounts
    }
}
