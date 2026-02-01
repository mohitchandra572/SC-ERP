import { prisma } from "../src/lib/db"
import { saveAttendance, getAttendanceList } from "../src/features/attendance/attendance-actions"
import { notificationService } from "../src/lib/notifications/notification-service"

async function verifyAttendance() {
    console.log("🧪 Starting Attendance & Notification Verification...")

    // 1. Setup: Ensure we have a class and a teacher
    const academicClass = await prisma.class.findFirst()
    const teacher = await prisma.user.findFirst({
        where: { roles: { some: { role: { name: 'TEACHER' } } } }
    })
    const student = await prisma.user.findFirst({
        where: { roles: { some: { role: { name: 'STUDENT' } } } },
        include: { profile: true }
    })

    if (!academicClass || !teacher || !student) {
        console.error("❌ Missing required seed data (Class, Teacher, or Student)")
        return
    }

    console.log(`Using Class: ${academicClass.name}, Teacher: ${teacher.fullName}, Student: ${student.fullName}`)

    // 2. Mock Auth for server actions (This is tricky since they use auth())
    // In actual tests we would use a test environment. Here we'll check logic directly.

    console.log("Testing Notification Queuing...")
    if (student.profile?.phone) {
        const sms = await notificationService.queueSms(student.profile.phone, "Test Message")
        console.log(`✅ SMS Queued: ${sms.id}`)
    } else {
        console.warn("⚠️ Student has no phone number, skipping SMS queue check")
    }

    // 3. Test In-app notification
    const notification = await notificationService.sendInApp(student.id, "Welcome", "Welcome to Phase 2", "SYSTEM")
    console.log(`✅ In-app notification sent: ${notification.id}`)

    // 4. Verify DB records for attendance
    // We'll simulate a save (without auth check for direct prisma test)
    const date = new Date()
    date.setHours(0, 0, 0, 0)

    try {
        await prisma.attendance.upsert({
            where: {
                studentId_classId_date: {
                    studentId: student.id,
                    classId: academicClass.id,
                    date
                }
            },
            update: { status: 'PRESENT', recordedById: teacher.id },
            create: {
                studentId: student.id,
                classId: academicClass.id,
                date,
                status: 'PRESENT',
                recordedById: teacher.id
            }
        })
        console.log("✅ Attendance record upsert successful")
    } catch (e) {
        console.error("❌ Attendance record upsert failed", e)
    }

    console.log("🎉 Verification complete")
}

verifyAttendance()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
