-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'GRADED', 'LATE');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('SYLLABUS', 'NOTICE', 'CERTIFICATE', 'OTHER');

-- CreateTable
CREATE TABLE "ui_menu_items" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "labelKey" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "iconKey" TEXT NOT NULL,
    "permissionRequired" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,

    CONSTRAINT "ui_menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ui_role_menu_overrides" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER,

    CONSTRAINT "ui_role_menu_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ui_dashboard_layouts" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "layout" JSONB NOT NULL,

    CONSTRAINT "ui_dashboard_layouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "academic_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "academic_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_attendances" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "recordedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_assignments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "maxMarks" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_assignment_submissions" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "contentUrl" TEXT,
    "marks" DOUBLE PRECISION,
    "feedback" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_assignment_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_exams" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "maxMarks" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_results" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "marksObtained" DOUBLE PRECISION NOT NULL,
    "grade" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_promotions" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "fromClassId" TEXT NOT NULL,
    "toClassId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "promotedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "academic_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutional_documents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL DEFAULT 'OTHER',
    "ownerId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutional_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ui_menu_items_key_key" ON "ui_menu_items"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ui_role_menu_overrides_roleId_menuItemId_key" ON "ui_role_menu_overrides"("roleId", "menuItemId");

-- CreateIndex
CREATE UNIQUE INDEX "ui_dashboard_layouts_roleId_key" ON "ui_dashboard_layouts"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "academic_classes_code_key" ON "academic_classes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "academic_subjects_code_key" ON "academic_subjects"("code");

-- CreateIndex
CREATE UNIQUE INDEX "academic_attendances_studentId_classId_date_key" ON "academic_attendances"("studentId", "classId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "academic_assignment_submissions_assignmentId_studentId_key" ON "academic_assignment_submissions"("assignmentId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "academic_results_examId_studentId_key" ON "academic_results"("examId", "studentId");

-- AddForeignKey
ALTER TABLE "ui_menu_items" ADD CONSTRAINT "ui_menu_items_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ui_menu_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ui_role_menu_overrides" ADD CONSTRAINT "ui_role_menu_overrides_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ui_role_menu_overrides" ADD CONSTRAINT "ui_role_menu_overrides_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "ui_menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ui_dashboard_layouts" ADD CONSTRAINT "ui_dashboard_layouts_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_attendances" ADD CONSTRAINT "academic_attendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_attendances" ADD CONSTRAINT "academic_attendances_classId_fkey" FOREIGN KEY ("classId") REFERENCES "academic_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_attendances" ADD CONSTRAINT "academic_attendances_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_assignments" ADD CONSTRAINT "academic_assignments_classId_fkey" FOREIGN KEY ("classId") REFERENCES "academic_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_assignments" ADD CONSTRAINT "academic_assignments_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "academic_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_assignments" ADD CONSTRAINT "academic_assignments_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_assignment_submissions" ADD CONSTRAINT "academic_assignment_submissions_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "academic_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_assignment_submissions" ADD CONSTRAINT "academic_assignment_submissions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_exams" ADD CONSTRAINT "academic_exams_classId_fkey" FOREIGN KEY ("classId") REFERENCES "academic_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_exams" ADD CONSTRAINT "academic_exams_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "academic_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_results" ADD CONSTRAINT "academic_results_examId_fkey" FOREIGN KEY ("examId") REFERENCES "academic_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_results" ADD CONSTRAINT "academic_results_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_promotions" ADD CONSTRAINT "academic_promotions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_promotions" ADD CONSTRAINT "academic_promotions_fromClassId_fkey" FOREIGN KEY ("fromClassId") REFERENCES "academic_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_promotions" ADD CONSTRAINT "academic_promotions_toClassId_fkey" FOREIGN KEY ("toClassId") REFERENCES "academic_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_promotions" ADD CONSTRAINT "academic_promotions_promotedById_fkey" FOREIGN KEY ("promotedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institutional_documents" ADD CONSTRAINT "institutional_documents_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
