# Verification & Hardening Checklist

This document outlines the procedures to verify the stability and security of the Phase 1 implementation.

## 🔑 Seeded Credentials Reference
Use these credentials for testing various roles (refer to `prisma/seed.ts` for actual data):
- **Admin**: `admin@school.com` / `password123`
- **Teacher**: `teacher@school.com` / `password123`
- **Student**: `student@school.com` / `password123`

## Phase 3: Enterprise Readiness Testing

### 1. Data Export Integrity
- **Scenario**: Admin exports 500+ records to CSV/Excel.
- **Validation**:
  - Ensure character encoding (UTF-8) handles Bangla text correctly.
  - Verify an `AuditLog` entry is created with the export scope.
  - Verify RBAC prevents non-authorized users from accessing the export endpoint.

### 2. Transactional Payroll
- **Scenario**: Process monthly payroll for all staff.
- **Validation**:
  - Prevent duplicate processing if triggered multiple times.
  - Verify total disbursement matches `SalaryGrade` logic (Base + Allowances - Deductions).
  - Check that personal payslips are inaccessible to other staff members.

### 3. Operability & Rollback
- **Scenario**: Modify site branding and trigger a rollback.
- **Validation**:
  - Verify original assets/values are restored exactly from `ConfigSnapshot`.
  - Ensure the rollback activity is attributed to the correct administrator in audit logs.

### 4. Production Communications
- **Scenario**: SMS gateway failure during bulk attendance.
- **Validation**:
  - Verify state in `SmsOutbox` remains `FAILED`.
  - Ensure a `SYSTEM` notification is sent to the administrator reporting the provider error.

## Phase 6: Enterprise Reporting

### 1. Multi-Format Institutional Exports
- **Scenario**: Export a class attendance report as PDF and a payment ledger as CSV.
- **Validation**:
  - **CSV (BOM test)**: Open the CSV in Excel and verify Bangla characters display correctly without manual encoding changes.
  - **PDF (High-Fidelity)**: Verify PDF layout includes the institution name (if implemented) and correct data alignment.
  - **Audit Trace**: Check `audit_logs` for an `EXPORT` access type with the correct resource (e.g., `accounting_fee_receipts`).

### 2. Individual Document Generation
- **Scenario**: Generate a PDF Fee Receipt for a student.
- **Validation**:
  - Verify the receipt contains the unique Transaction ID and collector name.
  - Ensure students can only download their own receipts (RBAC test).

### 3. Reporting Presets
- **Scenario**: Admin saves a "Class 5 - Unpaid Fees" filter as a preset.
- **Validation**:
  - Verify the preset is saved in `ui_report_presets`.
  - Ensure the preset can be retrieved and applied correctly by the same user.

## 🛡️ Security & RBAC Verification
- [ ] **Middleware Lockdown**: Attempt to access `/admin` while logged in as a Student.
  - *Expected*: Immediate redirect to `/forbidden`.
- [ ] **Unauthenticated Access**: Attempt to access `/admin` while logged out.
  - *Expected*: Redirect to `/login`.
- [ ] **Permission Bypassing**: Direct URL access to `/admin/users` as a user with only `roles.manage` but NOT `users.manage`.
  - *Expected*: Sidebar should NOT show the link, and server-side `hasPermission` should throw a 403 or return unauthorized if accessed via server action.

## 🌐 Stability & Global Logic
- [ ] **Environment Validation**: Rename `.env` to `.env.bak` and run `npm run dev`.
  - *Expected*: Application should crash immediately with a clear error listing missing variables.
- [ ] **Invalid URL Validation**: Set `NEXT_PUBLIC_APP_URL` to an invalid string (e.g., `not-a-url`).
  - *Expected*: Build or dev server should fail with a Zod validation error.
- [ ] **Fail-Fast Trigger**: Ensure `RootLayout` imports `@/lib/env` to trigger validation on page load.
- [ ] **Error Boundaries**: Trigger a manual error in a component (e.g., `throw new Error('Test')`).
  - *Expected*: Branded `error.tsx` should catch it and show a recovery button.
- [ ] **404 Handling**: Navigate to `/not-a-real-page`.
  - *Expected*: Branded `not-found.tsx` with a "Back to Home" button.
- [ ] **Language Persistence**: Change language to English, log out, and log in again.
  - *Expected*: Language should persist as English (synced from DB). Change to Bangla while logged out, refresh. Language should persist as Bangla (via cookie).

## 🎨 Branding & Identity
- [ ] **Public Shell**: Header and Footer should show the School Name (Bn/En) and EIIN correctly from `SchoolSettings`.
- [ ] **ERP Shell**: Sidebar logo and Institution Name should reflect branding.
- [ ] **SEO**: Inspect page source for `<title>` and `meta description` on the home page.
  - *Expected*: Values from `SchoolSettings` should be present.

## 📝 Scripted Audits

Run the following scripts to verify security and quality standards:

### 1. RBAC Security Audit
```bash
npm run audit:rbac
```
*Expected*: All server actions in `src/lib/actions` must have `auth()` and `hasPermission()` checks.

### 2. Enterprise Quality Audit
```bash
npm run audit:quality
```
*Expected*: 
- Verification of critical i18n keys for navigation and layout.
- Consistency check between `robots.ts` (disallowed routes) and `sitemap.ts` (allowed routes).

## 🚀 CI/CD Pipeline

The project uses GitHub Actions for continuous integration. Every PR must pass:
1. **Linting**: `npm run lint`
2. **Type Checking**: `npx tsc --noEmit`
3. **Security Audit**: `npm run audit:rbac`
4. **Quality Audit**: `npm run audit:quality`
5. **Production Build**: `npm run build`

## Institutional Storage & Media Verification

### 1. Storage Abstraction Layer
- [ ] **Policy Routing**: Upload a 'CERTIFICATE' and verify it goes to Cloudinary.
- [ ] **Secure Storage**: Upload 'PAYROLL' and verify it goes to Private storage.
- [ ] **Zero-Trust Access**: Verify that private documents are only accessible via signed URLs.

### 2. Document Auditing
- [ ] **Access Logs**: View a document and verify an entry in `institutional_document_access_logs`.
- [ ] **RBAC Protection**: Attempt to delete a document without `documents.manage` and verify 403.

### 3. High-Fidelity PDF Branding
- [ ] **Header Injection**: Generate any report and verify institutional name and EIIN.
- [ ] **Logo Resolution**: Verify that the school logo is correctly rendered from Cloudinary URL.
- [ ] **Official Pagination**: Verify footer contains page numbers and school name on every page.

## Enterprise HRM & Payroll Verification

### 1. Organizational Structure
- [ ] **Department Management**: Create "Academic" and "Administration" departments.
- [ ] **Designation Hierarchy**: Create "Principal" (Level 1) and "Senior Teacher" (Level 2).
- [ ] **Staff Assignment**: Onboard a teacher and verify department/designation link.

### 2. Salary Configuration
- [ ] **Component Definition**: Create "Basic Salary" (Earning) and "Provident Fund" (Deduction).
- [ ] **Structure Mapping**: Create a "Senior Staff Structure" with multiple components and assign it.

### 3. Monthly Payroll Lifecycle
- [ ] **Generation**: Trigger a payroll run and verify net pay calculation: `Net = Gross - Deductions`.
- [ ] **Lock & Approve**: Approve a run and verify that it becomes read-only and status changes to `PAID`.
- [ ] **Payslip Integrity**: Generate a payslip PDF and verify all component snapshots match the calculation.

## Configuration Maturity Verification

### 1. Versioning Lifecycle
- [ ] **Draft Isolation**: Save a dashboard change as Draft. Verify that regular users still see the Published version.
- [ ] **Publications**: Publish the draft. Verify that the version number increments and the change becomes live for users.
- [ ] **Sequential History**: Verify that `getConfigHistory` returns a list sorted by version (descending).

### 2. Rollback Safety
- [ ] **Non-Destructive Revert**: Rollback to V1. Verify that a *new* V3 is created (cloning V1's data) rather than deleting V2.
- [ ] **Audit Trail**: Confirm that the "ROLLBACK" action is logged in `audit_logs`.

### 3. Role-Based Access
- [ ] **Unauthorized Publish**: Attempt to publish a config without `config.publish`. Expect 403/Unauthorized.
- [ ] **Unauthorized Rollback**: Attempt to rollback without `config.rollback`. Expect 403.
