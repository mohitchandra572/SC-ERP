import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(1),
    AUTH_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
});

const _env = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL || process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
});

if (!_env.success) {
    const { fieldErrors } = _env.error.flatten();
    const errorMessage = Object.entries(fieldErrors)
        .map(([field, errors]) => `- ${field}: ${errors?.join(", ")}`)
        .join("\n");

    console.error("\n❌ Critical: Invalid environment variables:\n" + errorMessage + "\n");
    throw new Error("Invalid environment variables. Please check your .env file.");
}

export const env = _env.data;
