import { auth } from "@/lib/auth/auth"

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogMetadata {
    requestId?: string
    userId?: string
    action?: string
    resource?: string
    [key: string]: any
}

class Logger {
    private static instance: Logger

    private constructor() { }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger()
        }
        return Logger.instance
    }

    private formatMessage(level: LogLevel, message: string, meta: LogMetadata = {}) {
        return JSON.stringify({
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            ...meta,
            environment: process.env.NODE_ENV || 'development'
        })
    }

    async info(message: string, meta: LogMetadata = {}) {
        console.log(this.formatMessage('info', message, meta))
    }

    async warn(message: string, meta: LogMetadata = {}) {
        console.warn(this.formatMessage('warn', message, meta))
    }

    async error(message: string, error: any, meta: LogMetadata = {}) {
        const errorMeta = {
            ...meta,
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack,
                name: error.name
            } : error
        }
        console.error(this.formatMessage('error', message, errorMeta))

        // Placeholder for Sentry integration
        if (process.env.SENTRY_DSN) {
            // Sentry.captureException(error, { extra: meta })
        }
    }

    async debug(message: string, meta: LogMetadata = {}) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(this.formatMessage('debug', message, meta))
        }
    }
}

export const logger = Logger.getInstance()

/**
 * Higher Order Function to wrap server actions with logging and error tracking
 */
export function withReliability<T, R>(
    actionName: string,
    handler: (...args: T[]) => Promise<R>
) {
    return async (...args: T[]): Promise<R> => {
        const session = await auth()
        const requestId = crypto.randomUUID()
        const userId = session?.user?.id

        try {
            logger.info(`Action Started: ${actionName}`, { requestId, userId, args })
            const result = await handler(...args)
            logger.info(`Action Completed: ${actionName}`, { requestId, userId })
            return result
        } catch (error) {
            logger.error(`Action Failed: ${actionName}`, error, { requestId, userId, args })
            throw error
        }
    }
}
