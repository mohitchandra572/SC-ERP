# Phase 3 Permission Model

Phase 3 introduces enterprise-level permissions focused on institutional oversight, data mobility, and financial administration.

## 1. Exports & Data Mobility
Controls who can take data out of the system.
- `exports.academic`: Export student lists, marksheets, and attendance data.
- `exports.accounting`: Export fee collection data and financial reports.
- `exports.staff`: Export staff and payroll data.
- `exports.audit`: Export system audit logs.

## 2. Advanced Reporting
Visibility into aggregated data.
- `reports.financial`: Access to revenue, dues, and expense dashboards.
- `reports.academic`: Access to class performance analytics and trends.
- `reports.attendance`: Access to institutional attendance heatmaps.

## 3. HRM & Payroll
Core staff management permissions.
- `payroll.setup`: Define salary grades, allowances, and deductions.
- `payroll.process`: Execute monthly salary generation.
- `payroll.view.self`: Access personal payslips.
- `payroll.view.all`: Access institutional payroll records.
- `staff.manage`: Create and update staff profiles and contracts.

## 4. System & Operability
Governance and infrastructure control.
- `audit.view`: Access the system-wide audit trail.
- `config.rollback`: Ability to revert institutional settings to previous states.
- `sms.provider.manage`: Configure production SMS gateway credentials and routes.

## 5. Implementation Notes
- **Exports**: Every call to an export action must verify the relevant `exports.*` permission and trigger an audit log with `type: EXPORT`.
- **Payroll**: `payroll.process` requires a valid session with 2FA (recommended for future).
- **Rollback**: Every configuration change must store the "Before" state in `ConfigSnapshot`.
