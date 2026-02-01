# Architecture Documentation

## Overview
This is a **single-repository modular monolith** for a Bangladesh School Management Platform. The architecture emphasizes clear module boundaries, reusability, and scalability.

## Directory Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Public website routes
│   │   ├── (auth)/             # Authentication routes (login, etc.)
│   │   ├── (admin)/            # Admin dashboard routes
│   │   ├── (teacher)/          # Teacher dashboard routes
│   │   ├── (student)/          # Student dashboard routes
│   │   ├── (guardian)/         # Guardian dashboard routes
│   │   ├── api/                # API route handlers
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   │
│   ├── lib/                    # Core business logic & utilities
│   │   ├── auth/               # Authentication logic
│   │   │   ├── auth.ts         # NextAuth configuration
│   │   │   ├── auth.config.ts  # Auth config
│   │   │   └── auth-actions.ts # Auth server actions
│   │   ├── rbac/               # Role-Based Access Control
│   │   │   └── rbac.ts         # Permission checking logic
│   │   ├── branding/           # School branding
│   │   │   └── branding.ts     # Branding fetching logic
│   │   ├── i18n/               # Internationalization
│   │   │   ├── locales/        # Translation files
│   │   │   │   ├── bn.json     # Bangla translations
│   │   │   │   └── en.json     # English translations
│   │   │   ├── i18n-provider.tsx # I18n context provider
│   │   │   └── index.ts        # I18n exports
│   │   ├── db/                 # Database client
│   │   │   └── index.ts        # Prisma client singleton
│   │   ├── actions/            # Shared server actions
│   │   ├── validations/        # Zod schemas
│   │   └── utils.ts            # Utility functions
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── admin/              # Admin-specific components
│   │   ├── home/               # Public site components
│   │   └── layout/             # Layout components
│   │
│   ├── types/                  # TypeScript type definitions
│   │
│   └── middleware.ts           # Next.js middleware
│
├── prisma/                     # Database schema & migrations
│   ├── schema.prisma           # Prisma schema
│   ├── migrations/             # Database migrations
│   └── seed.ts                 # Database seeding script
│
├── spec/                       # Living documentation
│   ├── PRD.md                  # Product Requirements
│   ├── RBAC.md                 # RBAC specification
│   ├── DATA_MODEL.md           # Data model documentation
│   ├── I18N.md                 # Internationalization spec
│   └── ARCHITECTURE.md         # This file
│
└── public/                     # Static assets

```

## Module Boundaries

### 1. **lib/auth** - Authentication Module
**Responsibility**: User authentication, session management, login/logout flows.

**Exports**:
- `auth()` - Get current session
- `signIn()` - Sign in user
- `signOut()` - Sign out user
- `authenticate()` - Server action for login

**Dependencies**:
- `lib/db` - User data access
- NextAuth.js

**Rules**:
- ✅ Can be imported by: app routes, middleware, other lib modules
- ❌ Should NOT import from: components, app routes

---

### 2. **lib/rbac** - Role-Based Access Control
**Responsibility**: Permission checking, role management, access control logic.

**Exports**:
- `hasPermission(session, permission)` - Check if user has permission

**Dependencies**:
- NextAuth session types

**Rules**:
- ✅ Can be imported by: app routes, server actions, middleware
- ❌ Should NOT import from: components, app routes
- ⚠️ Always check permissions server-side, never trust client

---

### 3. **lib/branding** - School Branding
**Responsibility**: Fetch and apply school-specific branding (colors, logos, names).

**Exports**:
- `getSchoolSettings()` - Cached function to fetch settings

**Dependencies**:
- `lib/db` - Settings data access

**Rules**:
- ✅ Can be imported by: app layouts, server components
- ❌ Should NOT be called from client components directly
- ⚠️ Use React cache for performance

---

### 4. **lib/i18n** - Internationalization
**Responsibility**: Translation management, locale switching, i18n context.

**Exports**:
- `I18nProvider` - Context provider for i18n
- `useTranslation()` - Hook for translations
- `locales` - Translation objects

**Dependencies**:
- Translation JSON files

**Rules**:
- ✅ Wrap app in `I18nProvider`
- ✅ Use `t()` function for all user-facing strings
- ❌ NO hardcoded strings in UI
- ⚠️ Default locale: `bn` (Bangla)

---

### 5. **lib/db** - Database Access
**Responsibility**: Prisma client singleton, database connection management.

**Exports**:
- `prisma` - Prisma client instance
- All Prisma types

**Dependencies**:
- `@prisma/client`

**Rules**:
- ✅ Can be imported by: server actions, API routes, lib modules
- ❌ NEVER import in client components
- ⚠️ Always use in server-side code only

---

### 6. **components/** - UI Components
**Responsibility**: Reusable React components.

**Structure**:
- `ui/` - shadcn/ui base components (Button, Input, etc.)
- `admin/` - Admin-specific components
- `home/` - Public site components
- `layout/` - Layout components (headers, footers, etc.)

**Rules**:
- ✅ Can import from: `lib/i18n`, `lib/utils`
- ❌ Should NOT import from: `lib/db`, `lib/auth` (use props instead)
- ⚠️ Keep components pure and testable

---

### 7. **app/** - Next.js Routes
**Responsibility**: Page routing, layouts, API endpoints.

**Route Groups**:
- `(public)` - Public website pages
- `(auth)` - Login/logout pages
- `(admin)` - Admin dashboard
- `(teacher)` - Teacher dashboard
- `(student)` - Student dashboard
- `(guardian)` - Guardian dashboard

**Rules**:
- ✅ Can import from: all `lib/` modules, `components/`
- ✅ Use server components by default
- ⚠️ Protect routes with middleware or `auth()` checks
- ⚠️ Use RBAC checks for sensitive operations

---

## Data Flow

### Authentication Flow
```
User → Login Page → authenticate() → NextAuth → Session → Middleware → Protected Route
```

### RBAC Flow
```
User Action → Server Action → auth() → hasPermission() → Allow/Deny
```

### Branding Flow
```
Layout → getSchoolSettings() → Prisma → Cache → Apply Styles
```

### I18n Flow
```
App → I18nProvider → useTranslation() → t(key) → Translated String
```

---

## Design Principles

### 1. **Server-First**
- Fetch data on the server
- Use Server Components by default
- Client Components only when needed (interactivity, hooks)

### 2. **Type Safety**
- Use TypeScript everywhere
- Define types in `src/types/`
- Use Zod for runtime validation

### 3. **Security**
- Always validate on server
- Check permissions server-side
- Never trust client input
- Use RBAC for all sensitive operations

### 4. **Performance**
- Use React `cache()` for expensive operations
- Minimize client-side JavaScript
- Optimize images and assets

### 5. **Maintainability**
- Clear module boundaries
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Document complex logic

---

## Security Baseline

The platform implements a **defense-in-depth** strategy to protect institutional data:

### 1. Authentication Hardening
- **Secure Sessions**: Production cookies are `__Secure-` prefixed, `httpOnly`, `sameSite: lax`, and `secure: true`.
- **JWT Protection**: Sessions use signed JWTs with forced rotation.
- **Rate Limiting**: Critical endpoints (e.g., `/login`) utilize an in-memory rate limiter to prevent brute-force attacks.

### 2. RBAC Enforcement
- **Permission-Centric**: Every data mutation is protected by a `hasPermission()` check. Role names are never used for granular logic.
- **Server-Side Validation**: Permissions are always verified on the server before executing business logic.

### 3. Audit Logging
- **Traceability**: All administrative actions (branding changes, role edits, user management) are recorded in the `AuditLog` table.
- **Structured Data**: Audit logs capture metadata (user, action, resource, changes) for security compliance and incident response.

### 4. Code Quality
- **Zod Validation**: All external input is validated via Zod schemas before processing.
- **Fail-Fast Configuration**: Critical environment variables are validated at start-up to prevent execution in an insecure state.

---

## Path Aliases

```json
{
  "@/*": ["./src/*"]
}
```

**Usage**:
```typescript
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth/auth'
import { hasPermission } from '@/lib/rbac/rbac'
import { Button } from '@/components/ui/button'
```

---

## Testing Strategy

### Unit Tests
- Test `lib/` modules in isolation
- Mock database calls
- Test permission logic

### Integration Tests
- Test server actions end-to-end
- Test authentication flows
- Test RBAC enforcement

### E2E Tests
- Test critical user journeys
- Login → Dashboard → Action
- Test across roles

---

## Deployment

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - NextAuth secret
- `AUTH_URL` - Base URL for auth
- `NEXT_PUBLIC_APP_URL` - Public app URL

### Build Process
```bash
npm run build
npm run start
```

### Database Migrations
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## Future Enhancements

### Phase 1
- Academic modules (Students, Classes, Subjects)
- Attendance tracking
- Grade management

### Phase 2
- Fee management
- Reporting & analytics
- Parent portal

### Phase 3
- Mobile app
- SMS/Email notifications
- Advanced analytics

---

## Contributing

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages

### Pull Request Process
1. Create feature branch
2. Write tests
3. Update documentation
4. Submit PR for review

---

## Support

For questions or issues, refer to:
- `spec/PRD.md` - Product requirements
- `spec/RBAC.md` - Permission system
- `spec/DATA_MODEL.md` - Database schema
- `spec/I18N.md` - Translation guide
