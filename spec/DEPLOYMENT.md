# Deployment Guide

This document provides instructions for deploying the School Management System to production.

## Environment Variables

The application requires the following environment variables. Create a `.env` file in the root directory for local development or set them in your CI/CD platform (e.g., Vercel, GitHub Actions).

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Neon/Postgres connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `AUTH_SECRET` | Secret key for Auth.js (NextAuth v5) | `openssl rand -base64 32` |
| `AUTH_URL` | Base URL for auth callbacks | `https://your-domain.com/api/auth` |
| `NEXT_PUBLIC_APP_URL`| Canonical URL for SEO/Sitemap | `https://your-domain.com` |
| `NODE_ENV` | Environment mode | `production` |

> [!IMPORTANT]
> The application will **fail-fast** and refuse to start if any required environment variable is missing or malformed.

## Database Setup (Neon/Postgres)

1. **Create a Neon Project**: Sign up at [neon.tech](https://neon.tech) and create a new project.
2. **Connection String**: Copy the connection string from the Neon dashboard.
3. **Prisma Integration**:
    - Run migrations: `npx prisma migrate deploy`
    - Seed the database: `npx prisma db seed`

## Build and Start

1. **Install Dependencies**:
   ```bash
   npm ci
   ```
2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```
3. **Build the Application**:
   ```bash
   npm run build
   ```
4. **Start Production Server**:
   ```bash
   npm start
   ```

## Production Checklist

- [ ] All environment variables are validated via `src/lib/env.ts`.
- [ ] `NEXT_PUBLIC_APP_URL` is set to the production domain.
- [ ] Database migrations are successfully applied.
- [ ] RBAC Security Audit (`npm run audit:rbac`) passes.
- [ ] Quality/SEO Audit (`npm run audit:quality`) passes.
