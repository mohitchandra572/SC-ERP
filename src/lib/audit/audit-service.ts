import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"

export type AccessType = 'MUTATION' | 'VIEW' | 'EXPORT' | 'LOGIN' | 'ROLLBACK'

export interface AuditOptions {
    metadata?: any
    accessType?: AccessType
}

export const auditService = {
    /**
     * Standard log creation
     */
    async log(action: string, resource: string, details: any, options: AuditOptions = {}) {
        const session = await auth()

        try {
            return await prisma.auditLog.create({
                data: {
                    action,
                    resource,
                    details: details || {},
                    metadata: options.metadata || null,
                    accessType: options.accessType || 'MUTATION',
                    userId: session?.user?.id || null
                }
            })
        } catch (error) {
            console.error("Audit Service failure:", error)
            // Silence errors to prevent crashing main business logic
        }
    },

    /**
     * Log a mutation with before/after state comparison
     */
    async logMutation(action: string, resource: string, before: any, after: any, metadata?: any) {
        const diff = this.calculateDiff(before, after)

        return await this.log(action, resource, {
            before: before ? this.sanitize(before) : null,
            after: after ? this.sanitize(after) : null,
            diff
        }, { metadata, accessType: 'MUTATION' })
    },

    /**
     * Log an export event
     */
    async logExport(resource: string, scope: any) {
        return await this.log('EXPORT', resource, scope, { accessType: 'EXPORT' })
    },

    /**
     * Log a sensitive view event
     */
    async logView(resource: string, identifier: string) {
        return await this.log('VIEW', resource, { identifier }, { accessType: 'VIEW' })
    },

    /**
     * Internal utility to sanitize sensitive data
     */
    sanitize(obj: any) {
        if (!obj) return null
        const clone = JSON.parse(JSON.stringify(obj))
        const sensitiveFields = ['passwordHash', 'resetToken', 'secret', 'token']

        for (const field of sensitiveFields) {
            if (field in clone) clone[field] = '[REDACTED]'
        }
        return clone
    },

    /**
     * Basic diff calculation
     */
    calculateDiff(before: any, after: any) {
        if (!before) return after ? this.sanitize(after) : {}
        if (!after) return {}

        const diff: any = {}
        const keys = new Set([...Object.keys(before), ...Object.keys(after)])

        for (const key of keys) {
            if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
                diff[key] = {
                    from: before[key],
                    to: after[key]
                }
            }
        }
        return this.sanitize(diff)
    }
}
