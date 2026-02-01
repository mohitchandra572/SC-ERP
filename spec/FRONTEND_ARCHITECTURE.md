# Frontend Architecture Specification

This document outlines the architectural rules and best practices for the frontend of the School Management System.

## 1. Component Responsibility

### Server Components (Default)
- Use Server Components for data fetching (Prisma, Server Actions).
- Use for layouts and static SEO pages.
- Benefits: Smaller bundle size, secure data fetching, better performance.

### Client Components (`'use client'`)
- Use ONLY when interactivity is required (Event listeners, Hooks like `useState`, `useEffect`).
- Use for forms, modals, and interactive UI elements.
- **Rule**: Never import DB clients or Prisma directly in Client Components.

## 2. Module Boundaries

### Data Fetching
- **Server Components**: Can import `prisma` from `@/lib/db` or specialized service files.
- **Client Components**: Must use **Server Actions** for all data mutations and fetching.
- **Verification**: The CI pipeline runs `npm run audit:frontend` to detect direct DB access in Client Components.

## 3. Localization (i18n)

### User-Facing Strings
- **Rule**: All user-facing text nodes in `.tsx` files must be localized using the `t()` function.
- **Verification**: The CI pipeline scans for hardcoded text nodes and alerts on potential violations.
- **Exceptions**: Abbreviations (<= 3 chars), numeric values, and predefined symbols/icons.

## 4. State Management
- Prefer URL state (`next/navigation`) for filters, search, and pagination.
- Use `react-hook-form` and `zod` for complex form state.
- Use Context Providers minimally (e.g., for `i18n` or `auth` sessions).

## 5. Design System Alignment
- Follow [UI_SYSTEM.md](file:///e:/Web%20Development%20Journey/Day%2085/dev/School-managment-system/spec/UI_SYSTEM.md) for components and tokens.
- Use `shadcn/ui` as the foundation for high-quality, accessible UI elements.
