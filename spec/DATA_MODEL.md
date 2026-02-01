# Data Model Specification (Prisma)

## 1. Overview
Database: PostgreSQL
ORM: Prisma

## 2. Models

### `User`
- `id`: String (UUID)
- `email`: String (Unique)
- `passwordHash`: String
- `fullName`: String
- `isActive`: Boolean (Default true)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations: `UserProfile`, `UserRole`

### `UserProfile`
- `id`: String (UUID)
- `userId`: String (FK)
- `language`: String (Default 'bn') - Enum: ['bn', 'en']
- `phone`: String?
- Relations: `User`

### `Role`
- `id`: String (UUID)
- `name`: String (Unique) - e.g., "SCHOOL_ADMIN"
- `displayName`: String - e.g., "School Administrator"
- `description`: String?
- `isSystem`: Boolean (Default false) - Prevent deletion of core roles
- Relations: `UserRole`, `RolePermission`

### `Permission`
- `id`: String (UUID)
- `slug`: String (Unique) - e.g., "students.create"
- `description`: String
- Relations: `RolePermission`

### `RolePermission`
- `roleId`: String (FK)
- `permissionId`: String (FK)
- PK: (roleId, permissionId)

### `UserRole`
- `userId`: String (FK)
- `roleId`: String (FK)
- PK: (userId, roleId)

### `SchoolSettings` (Singleton Pattern)
- `id`: String (UUID)
- `schoolNameBn`: String
- `schoolNameEn`: String
- `logoUrl`: String?
- `primaryColor`: String (Default '#000000')
- `secondaryColor`: String
- `eiin`: String?
- `addressBn`: String
- `addressEn`: String
- `phone`: String
- `email`: String
- `footerTextBn`: String
- `footerTextEn`: String
- `updatedAt`: DateTime

---

### `Attendance`
- `id`: String (UUID)
- `studentId`: String (FK)
- `classId`: String (FK)
- `date`: Date
- `status`: Enum (PRESENT, ABSENT, LATE, EXCUSED)
- `recordedById`: String (FK to User)

### `Assignment`
- `id`: String (UUID)
- `title`: String
- `description`: String?
- `classId`: String (FK)
- `subjectId`: String (FK)
- `teacherId`: String (FK to User)
- `dueDate`: DateTime
- `maxMarks`: Int

### `AssignmentSubmission`
- `id`: String (UUID)
- `assignmentId`: String (FK)
- `studentId`: String (FK)
- `contentUrl`: String?
- `marks`: Float?
- `feedback`: String?
- `status`: Enum (SUBMITTED, GRADED, LATE)
- `submittedAt`: DateTime

### `Exam`
- `id`: String (UUID)
- `title`: String
- `term`: String (e.g., "First Term")
- `academicYear`: String
- `classId`: String (FK)
- `subjectId`: String (FK)
- `maxMarks`: Int

### `Result`
- `id`: String (UUID)
- `examId`: String (FK)
- `studentId`: String (FK)
- `marksObtained`: Float
- `grade`: String?
- `published`: Boolean (Default false)

### `PromotionHistory`
- `id`: String (UUID)
- `studentId`: String (FK)
- `fromClassId`: String (FK)
- `toClassId`: String (FK)
- `academicYear`: String
- `promotedById`: String (FK)

### `FeeHead`
- `id`: String (UUID)
- `name`: String (e.g., "Monthly Tuition")
- `amount`: Float
- `category`: Enum (ACADEMIC, ADMISSION, OTHER)
- `isOptional`: Boolean
- `description`: String?

### `StudentFee` (Allocated Dues)
- `id`: String (UUID)
- `studentId`: String (FK)
- `feeHeadId`: String (FK)
- `dueDate`: Date
- `status`: Enum (UNPAID, PAID, PARTIAL, WAIVED)
- `amount`: Float (Original)
- `discount`: Float (Applied discount)
- `paidAmount`: Float

### `FeeReceipt`
- `id`: String (UUID)
- `studentId`: String (FK)
- `amount`: Float
- `paymentMethod`: String (CASH, BKASH, BANK)
- `transactionId`: String?
- `collectedById`: String (FK)
- `createdAt`: DateTime

---

### `StaffDepartment`
- `id`: String (UUID)
- `name`: String (Unique)
- `description`: String?

### `StaffDesignation`
- `id`: String (UUID)
- `name`: String (Unique)
- `level`: Int

### `SalaryComponent`
- `id`: String (UUID)
- `name`: String (Unique)
- `type`: Enum (EARNING, DEDUCTION)
- `isFixed`: Boolean

### `SalaryStructure`
- `id`: String (UUID)
- `name`: String (Unique)
- `components`: Relation to `SalaryStructureComponent`

### `PayrollRun` (Monthly Container)
- `id`: String (UUID)
- `month`: Int
- `year`: Int
- `status`: Enum (PENDING, PROCESSING, APPROVED, CANCELLED)
- `totalGross`: Float
- `totalNet`: Float

### `Payslip`
- `id`: String (UUID)
- `payrollRunId`: String (FK)
- `staffProfileId`: String (FK)
- `grossAmount`: Float
- `netAmount`: Float
- `status`: Enum (PENDING, PAID)
- `components`: Snapshot of earnings/deductions

---

### `Notification`
- `id`: String (UUID)
- `userId`: String (FK)
- `title`: String
- `content`: String
- `type`: Enum (SYSTEM, ATTENDANCE, FEE, EXAM)
- `isRead`: Boolean
- `createdAt`: DateTime

### `SmsOutbox`
- `id`: String (UUID)
- `phoneNumber`: String
- `content`: String
- `status`: Enum (PENDING, SENT, FAILED)
- `provider`: String?
- `providerResponse`: String?
- `scheduledAt`: DateTime?
- `sentAt`: DateTime?
- `createdAt`: DateTime

## 3. Seeding Strategy
1. Upsert Permissions (Fixed list from RBAC.md).
2. Upsert System Roles.
3. specific Role-Permission assignments.
4. Create default Admin User.
5. Create default SchoolSettings.
