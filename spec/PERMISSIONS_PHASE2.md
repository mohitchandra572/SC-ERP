# Phase 2 Permission Keys (ERP Edition)

These keys are required to enforce RBAC across the new core ERP modules.

## Attendance & Messaging
- `attendance.view`: View attendance summaries.
- `attendance.take`: Mark/Enter attendance.
- `attendance.edit`: Modify historical attendance.
- `sms.send`: Manually trigger or approve SMS delivery.
- `sms.config`: Manage SMS templates and provider settings.

## Fees & Accounting
- `fees.view`: View financial records (own or wards).
- `fees.manage`: Create fee heads, set amounts, and record transactions.
- `fees.report`: Access financial audits and revenue reports.
- `fees.discount`: Apply waivers or discounts to students.

## Exams & Results
- `exams.manage`: Configure terms, dates, and schedules.
- `results.view`: View marks/grades.
- `results.enter`: Enter/Update marks (Teacher).
- `results.publish`: Finalize and publish results (Admin).

## Promotions
- `promotion.execute`: Perform bulk student promotions.
- `promotion.history`: View historical records.
- `promotion.bypass`: Bypass fees/academic gates (Admin only).

## Documents & CMS
- `docs.view`: View permitted documents.
- `docs.manage`: Upload/Manage institutional documents.

## Notifications
- `notifications.view`: View notification history.
- `notifications.admin`: Manage system-wide notification settings.
