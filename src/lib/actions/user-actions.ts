'use server'

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "./audit-helper"


export async function getUsers() {
    const session = await auth()
    if (!hasPermission(session, 'users.manage')) {
        throw new Error("Unauthorized")
    }

    return await prisma.user.findMany({
        include: {
            roles: {
                include: {
                    role: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function assignRole(userId: string, roleId: string) {
    const session = await auth()
    if (!hasPermission(session, 'users.manage')) {
        return { error: "Unauthorized" }
    }

    try {
        await prisma.userRole.upsert({
            where: {
                userId_roleId: { userId, roleId }
            },
            update: {},
            create: { userId, roleId }
        })
        await createAuditLog("ROLE_ASSIGN", "user_roles", { userId, roleId })
        revalidatePath("/admin/users")
        return { success: true }
    } catch (e) {
        return { error: "Failed to assign role" }
    }
}

export async function removeRole(userId: string, roleId: string) {
    const session = await auth()
    if (!hasPermission(session, 'users.manage')) {
        return { error: "Unauthorized" }
    }

    try {
        await prisma.userRole.delete({
            where: {
                userId_roleId: { userId, roleId }
            }
        })
        await createAuditLog("ROLE_REMOVE", "user_roles", { userId, roleId })
        revalidatePath("/admin/users")
        return { success: true }
    } catch (e) {
        return { error: "Failed to remove role" }
    }
}
