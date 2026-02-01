# Product Requirements Document (PRD) - Phase 0
**Project:** Bangladesh School Platform (Single-School)
**Phase:** 0 (Foundation MVP)

## 1. Executive Summary
A unified platform combining a public-facing school website and an internal School ERP.
Designed for the Bangladesh context with Bangla-first UI, robustness, and simplicity.

## 2. Core Objectives
- **Bangla-First:** Native experience for local users (teachers, guardians).
- **Security:** Strict RBAC and input validation.
- **Simplicity:** No complex animations, mobile-first, clean UI.
- **Maintainability:** Modular monolith architecture using Next.js App Router.

## 3. Scope of Work (Phase 0)
### In-Scope
1.  **Authentication**: Email/Password, Secure Sessions.
2.  **RBAC**: Granular permission system (not just roles).
3.  **i18n**: Toggle between Bangla (Default) and English.
4.  **Branding**: Admin-configurable colors, logo, and contact info.
5.  **Public Website**: Minimal Landing Page (Hero, Notices, Contact).
6.  **Database**: Robust Schema for Users, Roles, Permissions.

### Out-Scope
- Attendance Logic
- Exams/Results
- Fees/Payroll
- SMS/Email Gateways
- CMS Builder (use placeholders)
- Reports Engine

## 4. User Personas
- **School Admin**: Full system access, manages branding/roles.
- **Teacher**: Marks attendance (future), views students.
- **Student**: View profile/notices.
- **Guardian**: View ward's status.

## 5. Technical Constraints
- **Stack**: Next.js, TS, Tailwind, Prisma, PostgreSQL, Zod.
- **UI**: shadcn-style, responsive.
- **Performance**: Mobile-optimized.

## 6. Success Metrics
- Successful login/logout for all roles.
- Role-based redirection and access denial working correctly.
- Admin can change logo/colors and see immediate effect.
- Language toggle persists across sessions (for logged-in users).
