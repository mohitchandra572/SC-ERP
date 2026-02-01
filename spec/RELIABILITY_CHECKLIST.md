# Reliability Validation Checklist

## 1. Observability
- [/] **Structured Logs**: Verify that server actions produce JSON logs with `requestId` and `userId`.
- [ ] **Error Tracking**: Verify Sentry breadcrumbs and exception reports (if enabled).

## 2. Database Resilience
- [x] **Indexing**: Verify indexes exist for `Attendance`, `AuditLog`, `StudentFee`, `SmsOutbox`.
- [x] **Pagination**: Verify and test `/admin/audit` and `/admin/hr/staff` for paginated loads.
- [ ] **N+1 Check**: Verify that relationship inclusions (e.g., `user` in `AuditLog`) are atomic.

## 3. Communication Fault Tolerance
- [x] **Exponential Backoff**: Simulate failure in `MockSmsProvider` and verify increased `nextRetryAt` windows.
- [x] **Dead Lettering**: Verify that records move to `FAILED` after 5 unsuccessful attempts.
- [x] **Manual Recovery**: Use `/admin/diagnostics` to successfully retry a failed SMS.

## 4. Operational Safety
- [x] **Backup Verified**: Confirm `pg_dump` syntax is correct for institutional deployment.
- [x] **Restore Path**: Confirm clear instructions in `spec/OPS.md` for disaster recovery.
