# Security Baseline: Institutional Security & Audit

This document outlines the security architecture and baseline controls implemented for the School Management System.

## 1. Authentication & Session Security
- **JWT Strategy**: All sessions are stateless JWT-based, stored in `HttpOnly` cookies.
- **Production Cookie Prefixes**: In production, cookies use the `__Secure-` prefix to ensure they are only sent over HTTPS.
- **SameSite Policy**: `SameSite: Lax` is enforced to prevent most CSRF attacks while maintaining user experience for navigation.
- **Rate Limiting**:
    - **Login**: Max 5 attempts per 15 minutes per email.
    - **Public Search**: Max 10 requests per minute per IP.

## 2. Server-Side RBAC
RBAC is enforced at the server-action level. Every institutional mutation or data access must pass the `hasPermission(session, permission_slug)` gate before execution.

| Resource | Action | Permission Slug |
| :--- | :--- | :--- |
| Academic | View Exams | `results.view` |
| Academic | Enter Marks | `results.enter` |
| Academic | Publish | `results.publish` |
| Financial | View Fees | `fees.view` |
| Financial | Collection | `fees.manage` |
| HR | View Staff | `staff.view` |
| System | Settings | `settings.manage` |

## 3. High-Fidelity Auditing
The system captures every significant institutional event in the `AuditLog`.

- **Access Types**: `MUTATION`, `VIEW`, `EXPORT`, `ROLLBACK`.
- **Financial Diffs**: Fees and payments record the full state difference (before/after) to ensure financial traceability.
- **Export Tracking**: All CSV/Excel exports are logged with the actor's ID and the resource targeted.

## 4. Administrative Oversight
- **Audit Viewer**: Admins can monitor system health and actor behavior at `/admin/audit`.
- **Diagnostics**: Infrastructure health and communication outbox status are available at `/admin/diagnostics`.
