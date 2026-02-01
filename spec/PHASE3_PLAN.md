# Phase 3: Enterprise Readiness Plan

This plan transforms the core school ERP into an enterprise-grade solution, focusing on scalability, financial auditing, and human resource management.

## 1. Modules & Implementation Order

### I. Infrastructure & Security Maturity
- **Audit System 2.0**: Enhanced audit logging for all exports and sensitive data access.
- **Config Rollback**: Snapshot-based system for institutional settings (Branding, Academic Params).
- **Session Security**: Device tracking and concurrent session management.

### II. HRM & Payroll
- **Staff Profiles**: Comprehensive teacher/staff data (Contracts, Qualifications).
- **Salary Structures**: Grade-based or individual salary definitions (Base, HRA, Allowances, Deductions).
- **Payroll Processing**: Automated payslip generation with fees-integration (e.g., staff child discounts).

### III. Advanced Reporting & Exports
- **Universal Exporter**: CSV/PDF/Excel framework for all tables.
- **Financial Intelligence**: Collection vs. Dues reports, Expense tracking, and Net Profit/Loss.
- **Academic Analytics**: Class-wise performance trends and attendance heatmaps.

### IV. Production Communications
- **SMS Gateway 2.0**: Pluggable provider system (Twilio, BulkSMS BD) with retry logic and failure alerts.
- **Email Engines**: Automated result/payslip delivery.

## 2. Database Changes (Required)

| Model | Description |
|-------|-------------|
| `StaffProfile` | Links to `User`. Stores salary grade, joining date, etc. |
| `SalaryGrade` | Defines base and allowances (e.g., "Senior Teacher", "Admin"). |
| `Payroll` | Monthly records of paid salaries, deductions, and payslip links. |
| `ConfigSnapshot` | Stores JSON blobs of `SiteSettings` for rollback capability. |
| `AuditLog` | (Existing) Add `metadata` for change diffs and `access_type` (EXPORT/VIEW/MUTATION). |

## 3. Critical Permissions

See `PERMISSIONS_PHASE3.md` for full breakdown. Key gates:
- `exports.all`: Permission to download institutional data.
- `payroll.manage`: Authority to process monthly salaries.
- `reports.view.*`: Granular access to financial vs academic reports.

## 4. Acceptance Criteria
- All exports audited with user ID, timestamp, and query params.
- Payroll generation prevents double-payment for the same month/staff.
- SMS provider failure correctly triggers a system notification fallback.
- No direct database deletes; soft-deletes with audit trail for critical entities.
