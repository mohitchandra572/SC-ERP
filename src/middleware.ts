import NextAuth from "next-auth";
import { authConfig } from "./lib/auth/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

/**
 * Enhanced Middleware with Request Logging
 */
async function middleware(request: NextRequest) {
    const startTime = Date.now();
    const { pathname, search } = request.nextUrl;
    const method = request.method;

    // Skip logging for static assets and health checks
    const shouldSkipLogging =
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon') ||
        pathname === '/api/health';

    // Run authentication middleware
    const authMiddleware = NextAuth(authConfig).auth;
    const authResult = await authMiddleware(request as any);

    // Get response (authResult could be NextResponse or void)
    const response = authResult instanceof NextResponse ? authResult : NextResponse.next();

    // Log request/response
    if (!shouldSkipLogging) {
        const duration = Date.now() - startTime;
        const statusCode = response.status;

        logger.http(method, pathname + search, statusCode, duration, {
            userAgent: request.headers.get('user-agent') || 'unknown',
        });
    }

    return response;
}

export default middleware;

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
