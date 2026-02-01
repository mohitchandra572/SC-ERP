-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "classId" TEXT,
ADD COLUMN     "rollNo" TEXT;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_classId_fkey" FOREIGN KEY ("classId") REFERENCES "academic_classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
