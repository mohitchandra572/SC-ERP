'use server'

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "./audit-helper"


export async function getRoles() {
    const session = await auth()
    if (!hasPermission(session, 'roles.manage')) {
        throw new Error("Unauthorized")
    }

    return await prisma.role.findMany({
        include: {
            rolePermissions: {
                include: {
                    permission: true
                }
            }
        },
        orderBy: { name: 'asc' }
    })
}

export async function getPermissions() {
    const session = await auth()
    if (!hasPermission(session, 'roles.manage')) {
        throw new Error("Unauthorized")
    }

    return await prisma.permission.findMany({
        orderBy: { slug: 'asc' }
    })
}

export async function deleteRole(roleId: string) {
    const session = await auth()
    if (!hasPermission(session, 'roles.manage')) {
        return { error: "Unauthorized" }
    }

    const role = await prisma.role.findUnique({ where: { id: roleId } })
    if (role?.isSystem) {
        return { error: "System roles cannot be deleted" }
    }

    try {
        await prisma.role.delete({ where: { id: roleId } })
        await createAuditLog("ROLE_DELETE", "roles", { roleId, name: role?.name })
        revalidatePath("/admin/settings/roles")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete role" }
    }
}
