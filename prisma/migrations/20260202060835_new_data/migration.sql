/*
  Warnings:

  - You are about to drop the column `isPublic` on the `institutional_documents` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `institutional_documents` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `institutional_documents` table. All the data in the column will be lost.
  - Added the required column `ownerType` to the `institutional_documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageKey` to the `institutional_documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedById` to the `institutional_documents` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConfigStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SalaryComponentType" AS ENUM ('EARNING', 'DEDUCTION');

-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'RESIGNED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "institutional_documents" DROP CONSTRAINT "institutional_documents_ownerId_fkey";

-- AlterTable
ALTER TABLE "academic_exams" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "accessType" TEXT NOT NULL DEFAULT 'MUTATION',
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "institutional_documents" DROP COLUMN "isPublic",
DROP COLUMN "type",
DROP COLUMN "url",
ADD COLUMN     "docType" "DocumentType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "ownerType" TEXT NOT NULL,
ADD COLUMN     "publicUrl" TEXT,
ADD COLUMN     "storageKey" TEXT NOT NULL,
ADD COLUMN     "storageProvider" TEXT NOT NULL DEFAULT 'private',
ADD COLUMN     "uploadedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "system_sms_outbox" ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "nextRetryAt" TIMESTAMP(3),
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "institutional_storage_policies" (
    "id" TEXT NOT NULL,
    "docType" "DocumentType" NOT NULL,
    "storageProvider" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutional_storage_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_config_snapshots" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "ConfigStatus" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "publishedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_config_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ui_report_presets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ui_report_presets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutional_document_access_logs" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institutional_document_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_staff_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT,
    "designationId" TEXT,
    "salaryStructureId" TEXT,
    "salaryGradeId" TEXT,
    "joiningDate" DATE NOT NULL,
    "status" "StaffStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "hr_staff_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hr_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_designations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hr_designations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_salary_grades" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseSalary" DOUBLE PRECISION NOT NULL,
    "housing" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "medical" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "transport" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherAllow" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "hr_salary_grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_payroll_records" (
    "id" TEXT NOT NULL,
    "staffProfileId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "basePaid" DOUBLE PRECISION NOT NULL,
    "allowancePaid" DOUBLE PRECISION NOT NULL,
    "deduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netPaid" DOUBLE PRECISION NOT NULL,
    "paymentDate" DATE,
    "status" "PayrollStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "hr_payroll_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_salary_components" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SalaryComponentType" NOT NULL,
    "isFixed" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,

    CONSTRAINT "hr_salary_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_salary_structures" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "hr_salary_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_salary_structure_components" (
    "id" TEXT NOT NULL,
    "structureId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "hr_salary_structure_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_payroll_runs" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'PENDING',
    "totalGross" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDeductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalNet" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "processedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hr_payroll_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_payslips" (
    "id" TEXT NOT NULL,
    "payrollRunId" TEXT NOT NULL,
    "staffProfileId" TEXT NOT NULL,
    "grossAmount" DOUBLE PRECISION NOT NULL,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'PENDING',
    "paymentDate" TIMESTAMP(3),

    CONSTRAINT "hr_payslips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_payslip_components" (
    "id" TEXT NOT NULL,
    "payslipId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "SalaryComponentType" NOT NULL,

    CONSTRAINT "hr_payslip_components_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "institutional_storage_policies_docType_key" ON "institutional_storage_policies"("docType");

-- CreateIndex
CREATE INDEX "institutional_document_access_logs_documentId_idx" ON "institutional_document_access_logs"("documentId");

-- CreateIndex
CREATE INDEX "institutional_document_access_logs_userId_idx" ON "institutional_document_access_logs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "hr_staff_profiles_userId_key" ON "hr_staff_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "hr_departments_name_key" ON "hr_departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hr_designations_name_key" ON "hr_designations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hr_salary_grades_name_key" ON "hr_salary_grades"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hr_payroll_records_staffProfileId_month_year_key" ON "hr_payroll_records"("staffProfileId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "hr_salary_components_name_key" ON "hr_salary_components"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hr_salary_structures_name_key" ON "hr_salary_structures"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hr_salary_structure_components_structureId_componentId_key" ON "hr_salary_structure_components"("structureId", "componentId");

-- CreateIndex
CREATE UNIQUE INDEX "hr_payroll_runs_month_year_key" ON "hr_payroll_runs"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "hr_payslips_payrollRunId_staffProfileId_key" ON "hr_payslips"("payrollRunId", "staffProfileId");

-- CreateIndex
CREATE INDEX "academic_attendances_studentId_date_idx" ON "academic_attendances"("studentId", "date");

-- CreateIndex
CREATE INDEX "academic_attendances_classId_date_idx" ON "academic_attendances"("classId", "date");

-- CreateIndex
CREATE INDEX "academic_exams_classId_academicYear_idx" ON "academic_exams"("classId", "academicYear");

-- CreateIndex
CREATE INDEX "academic_exams_subjectId_idx" ON "academic_exams"("subjectId");

-- CreateIndex
CREATE INDEX "academic_promotions_studentId_academicYear_idx" ON "academic_promotions"("studentId", "academicYear");

-- CreateIndex
CREATE INDEX "academic_results_studentId_idx" ON "academic_results"("studentId");

-- CreateIndex
CREATE INDEX "academic_results_published_idx" ON "academic_results"("published");

-- CreateIndex
CREATE INDEX "accounting_fee_receipts_studentId_createdAt_idx" ON "accounting_fee_receipts"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "accounting_fee_receipts_collectedById_idx" ON "accounting_fee_receipts"("collectedById");

-- CreateIndex
CREATE INDEX "accounting_student_fees_studentId_status_idx" ON "accounting_student_fees"("studentId", "status");

-- CreateIndex
CREATE INDEX "accounting_student_fees_dueDate_idx" ON "accounting_student_fees"("dueDate");

-- CreateIndex
CREATE INDEX "audit_logs_userId_createdAt_idx" ON "audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_action_createdAt_idx" ON "audit_logs"("action", "createdAt");

-- CreateIndex
CREATE INDEX "institutional_documents_ownerId_ownerType_idx" ON "institutional_documents"("ownerId", "ownerType");

-- CreateIndex
CREATE INDEX "institutional_documents_storageProvider_idx" ON "institutional_documents"("storageProvider");

-- CreateIndex
CREATE INDEX "system_sms_outbox_status_scheduledAt_nextRetryAt_idx" ON "system_sms_outbox"("status", "scheduledAt", "nextRetryAt");

-- AddForeignKey
ALTER TABLE "ui_report_presets" ADD CONSTRAINT "ui_report_presets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institutional_documents" ADD CONSTRAINT "institutional_documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institutional_document_access_logs" ADD CONSTRAINT "institutional_document_access_logs_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "institutional_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institutional_document_access_logs" ADD CONSTRAINT "institutional_document_access_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_staff_profiles" ADD CONSTRAINT "hr_staff_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_staff_profiles" ADD CONSTRAINT "hr_staff_profiles_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "hr_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_staff_profiles" ADD CONSTRAINT "hr_staff_profiles_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "hr_designations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_staff_profiles" ADD CONSTRAINT "hr_staff_profiles_salaryStructureId_fkey" FOREIGN KEY ("salaryStructureId") REFERENCES "hr_salary_structures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_staff_profiles" ADD CONSTRAINT "hr_staff_profiles_salaryGradeId_fkey" FOREIGN KEY ("salaryGradeId") REFERENCES "hr_salary_grades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_payroll_records" ADD CONSTRAINT "hr_payroll_records_staffProfileId_fkey" FOREIGN KEY ("staffProfileId") REFERENCES "hr_staff_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_salary_structure_components" ADD CONSTRAINT "hr_salary_structure_components_structureId_fkey" FOREIGN KEY ("structureId") REFERENCES "hr_salary_structures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_salary_structure_components" ADD CONSTRAINT "hr_salary_structure_components_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "hr_salary_components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_payroll_runs" ADD CONSTRAINT "hr_payroll_runs_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_payslips" ADD CONSTRAINT "hr_payslips_payrollRunId_fkey" FOREIGN KEY ("payrollRunId") REFERENCES "hr_payroll_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_payslips" ADD CONSTRAINT "hr_payslips_staffProfileId_fkey" FOREIGN KEY ("staffProfileId") REFERENCES "hr_staff_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_payslip_components" ADD CONSTRAINT "hr_payslip_components_payslipId_fkey" FOREIGN KEY ("payslipId") REFERENCES "hr_payslips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_payslip_components" ADD CONSTRAINT "hr_payslip_components_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "hr_salary_components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
