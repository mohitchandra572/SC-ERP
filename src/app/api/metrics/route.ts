import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { hasPermission } from "@/lib/rbac/rbac";
import { prisma } from "@/lib/db";

/**
 * Metrics Endpoint (Protected)
 * GET /api/metrics
 * 
 * Returns application metrics for monitoring
 * Requires admin permissions
 */
export async function GET() {
    try {
        const session = await auth();

        // Require authentication and admin permission
        if (!session || !hasPermission(session, "view:analytics")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const startTime = Date.now();

        // Gather metrics
        const [
            totalUsers,
            activeUsers,
            totalStudents,
            totalTeachers,
            totalClasses,
            recentErrors,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { isActive: true } }),
            prisma.userProfile.count(),
            prisma.staffProfile.count({ where: { status: 'ACTIVE' } }),
            prisma.class.count(),
            prisma.auditLog.count({
                where: {
                    action: { contains: 'error' },
                    createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                },
            }),
        ]);

        // Database metrics
        const dbMetrics = {
            totalUsers,
            activeUsers,
            totalStudents,
            totalTeachers,
            totalClasses,
        };

        // Error metrics
        const errorMetrics = {
            last24Hours: recentErrors,
        };

        // System metrics
        const systemMetrics = {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            nodeVersion: process.version,
            platform: process.platform,
        };

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            responseTime: Date.now() - startTime,
            database: dbMetrics,
            errors: errorMetrics,
            system: systemMetrics,
        });
    } catch (error) {
        console.error("Metrics endpoint error:", error);
        return NextResponse.json(
            { error: "Failed to fetch metrics" },
            { status: 500 }
        );
    }
}
