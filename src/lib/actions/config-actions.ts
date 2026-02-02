"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"
import { revalidatePath } from "next/cache"
import { auditService } from "@/lib/audit/audit-service"
import { ConfigStatus } from "@prisma/client"

/**
 * Save a configuration as a draft
 */
export async function saveConfigDraft(key: string, data: any, description?: string) {
    const session = await auth()
    if (!hasPermission(session, 'config.manage')) throw new Error("Unauthorized")

    // Get latest version number for this key
    const latest = await prisma.configSnapshot.findFirst({
        where: { key },
        orderBy: { version: 'desc' }
    })

    const version = (latest?.version || 0) + 1

    const snapshot = await prisma.configSnapshot.create({
        data: {
            key,
            data,
            version,
            status: 'DRAFT',
            description,
            createdBy: session!.user!.id!
        }
    })

    await auditService.logMutation("system_config_snapshots", "CREATE_DRAFT", null, { id: snapshot.id, key, version })
    return { success: true, id: snapshot.id }
}

/**
 * Publish a configuration version
 */
export async function publishConfig(snapshotId: string) {
    const session = await auth()
    if (!hasPermission(session, 'config.publish')) throw new Error("Unauthorized")

    const snapshot = await prisma.configSnapshot.findUnique({
        where: { id: snapshotId }
    })

    if (!snapshot) throw new Error("Snapshot not found")
    if (snapshot.status === 'PUBLISHED') return { success: true }

    // Use transaction to archive current and publish new
    await prisma.$transaction([
        // Archive existing published version for this key
        prisma.configSnapshot.updateMany({
            where: { key: snapshot.key, status: 'PUBLISHED' },
            data: { status: 'ARCHIVED' }
        }),
        // Publish this one
        prisma.configSnapshot.update({
            where: { id: snapshotId },
            data: {
                status: 'PUBLISHED',
                publishedAt: new Date(),
                publishedBy: session!.user!.id!
            }
        })
    ])

    await auditService.logMutation("system_config_snapshots", "PUBLISH", snapshot, { ...snapshot, status: 'PUBLISHED' })

    // Global revalidate since config affects many parts of the UI
    revalidatePath("/", "layout")
    return { success: true }
}

/**
 * Rollback to a specific version
 * Note: Creates a NEW version with the old data for sequential audit/history
 */
export async function rollbackConfig(snapshotId: string) {
    const session = await auth()
    if (!hasPermission(session, 'config.rollback')) throw new Error("Unauthorized")

    const source = await prisma.configSnapshot.findUnique({
        where: { id: snapshotId }
    })

    if (!source) throw new Error("Source snapshot not found")

    // Get latest version for sequential numbering
    const latest = await prisma.configSnapshot.findFirst({
        where: { key: source.key },
        orderBy: { version: 'desc' }
    })

    const newVersionNum = (latest?.version || 0) + 1

    // Create new published version from source data
    await prisma.$transaction([
        prisma.configSnapshot.updateMany({
            where: { key: source.key, status: 'PUBLISHED' },
            data: { status: 'ARCHIVED' }
        }),
        prisma.configSnapshot.create({
            data: {
                key: source.key,
                data: source.data as any,
                version: newVersionNum,
                status: 'PUBLISHED',
                description: `Rollback to version ${source.version}`,
                createdBy: session!.user!.id!,
                publishedAt: new Date(),
                publishedBy: session!.user!.id!
            }
        })
    ])

    await auditService.logMutation("system_config_snapshots", "ROLLBACK", { key: source.key, version: source.version }, { key: source.key, version: newVersionNum })
    revalidatePath("/", "layout")
    return { success: true }
}

/**
 * Get configuration history
 */
export async function getConfigHistory(key: string) {
    const session = await auth()
    if (!hasPermission(session, 'config.manage')) throw new Error("Unauthorized")

    return await prisma.configSnapshot.findMany({
        where: { key },
        orderBy: { version: 'desc' }
    })
}

/**
 * Get currently active configuration
 */
export async function getActiveConfig(key: string) {
    return await prisma.configSnapshot.findFirst({
        where: { key, status: 'PUBLISHED' }
    })
}
