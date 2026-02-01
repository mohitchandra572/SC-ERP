'use server'

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"

export async function getClasses() {
    const session = await auth()
    if (!hasPermission(session, 'attendance.view') && !hasPermission(session, 'students.view')) {
        return []
    }

    return await prisma.class.findMany({
        orderBy: { code: 'asc' }
    })
}
