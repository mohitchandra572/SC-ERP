/**
 * Simple in-memory rate limiter for server-side rate limiting.
 * Note: This is per-instance and resets on server restart.
 * For a production environment with multiple instances, use Redis or similar.
 */

interface RateLimitInfo {
    count: number;
    lastAttempt: number;
}

const cache = new Map<string, RateLimitInfo>();

interface RateLimitOptions {
    limit: number;      // Maximum attempts
    windowMs: number;   // Time window in milliseconds
}

export function isRateLimited(key: string, options: RateLimitOptions): boolean {
    const now = Date.now();
    const info = cache.get(key);

    if (!info) {
        cache.set(key, { count: 1, lastAttempt: now });
        return false;
    }

    // Reset count if window has passed
    if (now - info.lastAttempt > options.windowMs) {
        cache.set(key, { count: 1, lastAttempt: now });
        return false;
    }

    if (info.count >= options.limit) {
        return true;
    }

    info.count += 1;
    info.lastAttempt = now;
    cache.set(key, info);
    return false;
}
