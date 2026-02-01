import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"

export type AuditAccessType = 'MUTATION' | 'VIEW' | 'EXPORT' | 'ROLLBACK'

export async function createAuditLog(
    action: string,
    resource: string,
    details: any,
    metadata?: any,
    accessType: AuditAccessType = 'MUTATION'
) {
    const session = await auth()

    try {
        return await prisma.auditLog.create({
            data: {
                action,
                resource,
                details,
                metadata,
                accessType,
                userId: session?.user?.id || null
            }
        })
    } catch (error) {
        console.error("Failed to create audit log:", error)
        // We don't throw here to avoid failing the main action if logging fails
    }
}
