# Phase 2: Core School ERP Roadmap (Updated)

This roadmap outlines the implementation of critical ERP functionality for Bangladesh school management, ensuring enterprise-grade security and traceability.

## 1. Module: Attendance + Guardian Messaging
**Goal**: Tracking student presence with automated SMS-ready notifications to guardians.

### Scope
- **Daily Attendance**: Bulk entry for classes/sections.
- **Messaging Triggers**: Automated generation of "Absent" notifications in the outbox.
- **Outbox Pattern**: Notifications stored in a queue for delivery via SMS provider adapter.

### Acceptance Criteria
- [ ] Audit log for all attendance entries and overrides.
- [ ] SMS outbox correctly identifies the guardian's contact info.
- [ ] RBAC: `attendance.take`, `sms.send`.

---

## 2. Module: Fees & Accounting Lite
**Goal**: Financial management of student fees and basic institutional accounting.

### Scope
- **Fee Heads**: Flexible creation of fee types (Admission, Monthly, Exam, Sadka).
- **Student Dues**: automated generation of monthly dues.
- **Receipting**: Recording payments and generating digital receipts.

### Acceptance Criteria
- [ ] Comprehensive audit log for every transaction and fee head change.
- [ ] Student dashboard shows clear due/paid status.
- [ ] RBAC: `fees.manage`, `fees.report`.

---

## 3. Module: Exams & Results
**Goal**: Managing academic terms, mass mark entry, and official reporting.

### Scope
- **Term Management**: Defining exam terms and weightages.
- **Bulk Entry**: Optimized UI for teachers to enter marks for their courses.
- **Publishing**: Formal "Publish" action that makes results visible to parents/students.

### Acceptance Criteria
- [ ] Audit log recorded for the "Publish" action and any mark corrections after publish.
- [ ] Validated marks entry (0 to max-marks).
- [ ] RBAC: `exams.manage`, `results.enter`, `results.publish`.

---

## 4. Module: Promotion (with Fees Clearance)
**Goal**: Transitioning students to the next academic year.

### Scope
- **Clearance Gate**: Students cannot be promoted unless fees are cleared.
- **Academic Gate**: Students must meet the minimum result criteria.
- **Transition**: Automated updating of class/section assignments for the new year.

### Acceptance Criteria
- [ ] Audit log for every student promotion or retention.
- [ ] Clear warning display for students blocked by dues.
- [ ] RBAC: `promotion.execute`.

---

## 5. Module: Notifications Pipeline
**Goal**: Centralized notification management.

### Scope
- **Provider Adapters**: Pluggable architecture for SMS (SSLWireless/Infobip) and Email.
- **Outbox**: Structured queue for transactional messages.
- **Templates**: Centralized management of SMS templates.

---

## 6. Nice-to-Have (Lower Priority)
- **Documents**: Institutional storage for syllabus and notices.
- **Assignments**: Digital homework distribution.
