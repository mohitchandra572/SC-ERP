import { z } from "zod";

/**
 * Helper to handle empty strings as undefined for optional fields
 */
const emptyStringToUndefined = z.string().transform(val => val === "" ? undefined : val);

/**
 * Environment Variable Schema
 * Validates all required and optional environment variables at startup
 */
const envSchema = z.object({
    // ========== REQUIRED ==========
    DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL connection string"),
    AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters for security"),
    NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    // ========== OPTIONAL - Authentication ==========
    AUTH_URL: emptyStringToUndefined.pipe(z.string().url().optional()),

    // ========== OPTIONAL - Cloudinary Storage ==========
    CLOUDINARY_CLOUD_NAME: emptyStringToUndefined.optional(),
    CLOUDINARY_API_KEY: emptyStringToUndefined.optional(),
    CLOUDINARY_API_SECRET: emptyStringToUndefined.optional(),

    // ========== OPTIONAL - SMS Provider ==========
    SMS_API_URL: emptyStringToUndefined.pipe(z.string().url().optional()),
    SMS_API_KEY: emptyStringToUndefined.optional(),
    SMS_PROVIDER: emptyStringToUndefined.optional(),

    // ========== OPTIONAL - Email/SMTP ==========
    SMTP_HOST: emptyStringToUndefined.optional(),
    SMTP_PORT: emptyStringToUndefined.optional(),
    SMTP_USER: emptyStringToUndefined.optional(),
    SMTP_PASSWORD: emptyStringToUndefined.optional(),
    SMTP_FROM_EMAIL: emptyStringToUndefined.pipe(z.string().email().optional()),
    SMTP_FROM_NAME: emptyStringToUndefined.optional(),

    // ========== OPTIONAL - Monitoring ==========
    SENTRY_DSN: emptyStringToUndefined.pipe(z.string().url().optional()),
    SENTRY_AUTH_TOKEN: emptyStringToUndefined.optional(),
    SENTRY_ORG: emptyStringToUndefined.optional(),
    SENTRY_PROJECT: emptyStringToUndefined.optional(),
    SENTRY_ENABLED: z.preprocess(val => val === "true", z.boolean().default(false)),

    // ========== OPTIONAL - Logging ==========
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
    LOG_JSON: z.preprocess(val => val === "true", z.boolean().default(false)),

    // ========== OPTIONAL - Security ==========
    RATE_LIMIT_MAX: z.preprocess(val => val ? Number(val) : 100, z.number().default(100)),
    RATE_LIMIT_WINDOW_MS: z.preprocess(val => val ? Number(val) : 60000, z.number().default(60000)),
    SESSION_MAX_AGE: z.preprocess(val => val ? Number(val) : 604800, z.number().default(604800)),

    // ========== OPTIONAL - Feature Flags ==========
    FEATURE_SMS_NOTIFICATIONS: z.preprocess(val => val === "true", z.boolean().default(false)),
    FEATURE_EMAIL_NOTIFICATIONS: z.preprocess(val => val === "true", z.boolean().default(false)),
    FEATURE_CLOUDINARY_STORAGE: z.preprocess(val => val === "true", z.boolean().default(false)),

    // ========== OPTIONAL - Development ==========
    NEXT_PUBLIC_SHOW_ERRORS: z.preprocess(val => val === "true", z.boolean().optional()),
    NEXT_TELEMETRY_DISABLED: emptyStringToUndefined.optional(),
});

/**
 * Parse and validate environment variables
 */
const _env = envSchema.safeParse({
    // Required
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,

    // Optional - Authentication
    AUTH_URL: process.env.AUTH_URL || process.env.NEXTAUTH_URL,

    // Optional - Cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    // Optional - SMS
    SMS_API_URL: process.env.SMS_API_URL,
    SMS_API_KEY: process.env.SMS_API_KEY,
    SMS_PROVIDER: process.env.SMS_PROVIDER,

    // Optional - Email
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,

    // Optional - Monitoring
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_ENABLED: process.env.SENTRY_ENABLED,

    // Optional - Logging
    LOG_LEVEL: process.env.LOG_LEVEL,
    LOG_JSON: process.env.LOG_JSON,

    // Optional - Security
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    SESSION_MAX_AGE: process.env.SESSION_MAX_AGE,

    // Optional - Feature Flags
    FEATURE_SMS_NOTIFICATIONS: process.env.FEATURE_SMS_NOTIFICATIONS,
    FEATURE_EMAIL_NOTIFICATIONS: process.env.FEATURE_EMAIL_NOTIFICATIONS,
    FEATURE_CLOUDINARY_STORAGE: process.env.FEATURE_CLOUDINARY_STORAGE,

    // Optional - Development
    NEXT_PUBLIC_SHOW_ERRORS: process.env.NEXT_PUBLIC_SHOW_ERRORS,
    NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED,
});

/**
 * Handle validation errors with helpful messages
 */
if (!_env.success) {
    const { fieldErrors } = _env.error.flatten();
    const errorMessage = Object.entries(fieldErrors)
        .map(([field, errors]) => `  ❌ ${field}: ${errors?.join(", ")}`)
        .join("\n");

    console.error("\n" + "=".repeat(80));
    console.error("❌ CRITICAL ERROR: Invalid Environment Variables");
    console.error("=".repeat(80));
    console.error("\nThe following environment variables are missing or invalid:\n");
    console.error(errorMessage);
    console.error("\n" + "=".repeat(80));
    console.error("📝 Please check your .env file against .env.example");
    console.error("💡 Copy .env.example to .env and fill in the required values");
    console.error("=".repeat(80) + "\n");

    throw new Error("Invalid environment variables. Application cannot start.");
}

/**
 * Validated and typed environment variables
 * Safe to use throughout the application
 */
export const env = _env.data;

/**
 * Helper to check if optional features are enabled
 */
export const features = {
    smsNotifications: env.FEATURE_SMS_NOTIFICATIONS,
    emailNotifications: env.FEATURE_EMAIL_NOTIFICATIONS,
    cloudinaryStorage: env.FEATURE_CLOUDINARY_STORAGE,
    sentryEnabled: env.SENTRY_ENABLED ?? false,
} as const;

/**
 * Log environment configuration on startup (development only)
 */
if (env.NODE_ENV === "development") {
    console.log("\n✅ Environment variables validated successfully");
    console.log("📋 Configuration:");
    console.log(`   - Environment: ${env.NODE_ENV}`);
    console.log(`   - App URL: ${env.NEXT_PUBLIC_APP_URL}`);
    console.log(`   - Log Level: ${env.LOG_LEVEL}`);
    console.log(`   - Features: SMS=${features.smsNotifications}, Email=${features.emailNotifications}, Cloudinary=${features.cloudinaryStorage}`);
    console.log("");
}

