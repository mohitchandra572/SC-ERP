import { auth } from "@/lib/auth/auth";
import { env } from "@/lib/env";

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMetadata {
    requestId?: string;
    userId?: string;
    action?: string;
    resource?: string;
    duration?: number;
    statusCode?: number;
    [key: string]: any;
}

interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    environment: string;
    metadata?: LogMetadata;
}

/**
 * Enhanced Logger with structured logging and log levels
 */
class Logger {
    private static instance: Logger;
    private logLevel: LogLevel;
    private useJsonFormat: boolean;

    private constructor() {
        this.logLevel = env.LOG_LEVEL;
        this.useJsonFormat = env.LOG_JSON;
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        const currentLevelIndex = levels.indexOf(this.logLevel);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex >= currentLevelIndex;
    }

    private formatMessage(level: LogLevel, message: string, meta: LogMetadata = {}): string {
        const logEntry: LogEntry = {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            environment: env.NODE_ENV,
            ...(Object.keys(meta).length > 0 && { metadata: meta }),
        };

        if (this.useJsonFormat) {
            return JSON.stringify(logEntry);
        }

        // Human-readable format for development
        const metaStr = Object.keys(meta).length > 0
            ? ` | ${JSON.stringify(meta)}`
            : '';
        return `[${logEntry.timestamp}] ${logEntry.level}: ${message}${metaStr}`;
    }

    private log(level: LogLevel, message: string, meta: LogMetadata = {}) {
        if (!this.shouldLog(level)) return;

        const formatted = this.formatMessage(level, message, meta);

        switch (level) {
            case 'debug':
                console.debug(formatted);
                break;
            case 'info':
                console.log(formatted);
                break;
            case 'warn':
                console.warn(formatted);
                break;
            case 'error':
                console.error(formatted);
                break;
        }
    }

    debug(message: string, meta: LogMetadata = {}) {
        this.log('debug', message, meta);
    }

    info(message: string, meta: LogMetadata = {}) {
        this.log('info', message, meta);
    }

    warn(message: string, meta: LogMetadata = {}) {
        this.log('warn', message, meta);
    }

    error(message: string, error?: any, meta: LogMetadata = {}) {
        const errorMeta: LogMetadata = {
            ...meta,
            ...(error && {
                error: error instanceof Error ? {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                } : error
            }),
        };

        this.log('error', message, errorMeta);

        // Send to Sentry if enabled
        if (env.SENTRY_ENABLED && error) {
            this.sendToSentry(error, errorMeta);
        }
    }

    private sendToSentry(error: any, meta: LogMetadata) {
        // Placeholder for Sentry integration
        // Will be implemented when @sentry/nextjs is installed
        if (typeof window !== 'undefined' && (window as any).Sentry) {
            (window as any).Sentry.captureException(error, { extra: meta });
        } else if (typeof global !== 'undefined' && (global as any).Sentry) {
            (global as any).Sentry.captureException(error, { extra: meta });
        }
    }

    /**
     * Log HTTP request/response
     */
    http(method: string, path: string, statusCode: number, duration: number, meta: LogMetadata = {}) {
        const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
        this.log(level, `${method} ${path} ${statusCode}`, {
            ...meta,
            method,
            path,
            statusCode,
            duration,
        });
    }

    /**
     * Log performance metrics
     */
    performance(operation: string, duration: number, meta: LogMetadata = {}) {
        const level: LogLevel = duration > 1000 ? 'warn' : 'debug';
        this.log(level, `Performance: ${operation} took ${duration}ms`, {
            ...meta,
            operation,
            duration,
        });
    }
}

export const logger = Logger.getInstance();

/**
 * Higher Order Function to wrap server actions with logging and error tracking
 */
export function withReliability<T extends any[], R>(
    actionName: string,
    handler: (...args: T) => Promise<R>
) {
    return async (...args: T): Promise<R> => {
        const startTime = Date.now();
        const requestId = crypto.randomUUID();
        let userId: string | undefined;

        try {
            const session = await auth();
            userId = session?.user?.id;

            logger.info(`Action Started: ${actionName}`, {
                requestId,
                userId,
                argsCount: args.length,
            });

            const result = await handler(...args);
            const duration = Date.now() - startTime;

            logger.info(`Action Completed: ${actionName}`, {
                requestId,
                userId,
                duration,
            });

            if (duration > 3000) {
                logger.warn(`Slow Action: ${actionName} took ${duration}ms`, {
                    requestId,
                    userId,
                    duration,
                });
            }

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            logger.error(`Action Failed: ${actionName}`, error, {
                requestId,
                userId,
                duration,
                argsCount: args.length,
            });
            throw error;
        }
    };
}

/**
 * Measure execution time of a function
 */
export async function measurePerformance<T>(
    operation: string,
    fn: () => Promise<T>
): Promise<T> {
    const startTime = Date.now();
    try {
        const result = await fn();
        const duration = Date.now() - startTime;
        logger.performance(operation, duration);
        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`Performance measurement failed: ${operation}`, error, { duration });
        throw error;
    }
}

