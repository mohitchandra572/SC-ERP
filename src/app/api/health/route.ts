import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Health Check Endpoint
 * GET /api/health
 * 
 * Returns the health status of the application and its dependencies
 */
export async function GET() {
    const startTime = Date.now();
    const checks: Record<string, { status: 'healthy' | 'unhealthy'; message?: string; latency?: number }> = {};

    // Check database connectivity
    try {
        const dbStart = Date.now();
        await prisma.$queryRaw`SELECT 1`;
        checks.database = {
            status: 'healthy',
            latency: Date.now() - dbStart,
        };
    } catch (error) {
        checks.database = {
            status: 'unhealthy',
            message: error instanceof Error ? error.message : 'Database connection failed',
        };
    }

    // Check environment configuration
    checks.environment = {
        status: process.env.DATABASE_URL && process.env.AUTH_SECRET ? 'healthy' : 'unhealthy',
        message: process.env.DATABASE_URL && process.env.AUTH_SECRET
            ? 'All required environment variables are set'
            : 'Missing required environment variables',
    };

    // Overall health status
    const isHealthy = Object.values(checks).every(check => check.status === 'healthy');
    const statusCode = isHealthy ? 200 : 503;

    return NextResponse.json(
        {
            status: isHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            responseTime: Date.now() - startTime,
            checks,
            version: process.env.npm_package_version || '0.1.0',
            environment: process.env.NODE_ENV,
        },
        { status: statusCode }
    );
}
