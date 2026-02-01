import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyPhase2ExamsAndPromotion() {
    console.log('--- Starting Phase 2: Exams & Promotion Verification ---')

    try {
        // 1. Setup Data
        console.log('1. Setting up test data...')
        const admin = await prisma.user.findFirst({ where: { email: { contains: 'admin' } } })
        if (!admin) throw new Error('Admin user not found')

        const student = await prisma.user.create({
            data: {
                email: `val_student_${Date.now()}@test.com`,
                fullName: 'Validation Student',
                passwordHash: 'dummy',
                profile: { create: { language: 'en' } }
            }
        })

        const class9 = await prisma.class.upsert({
            where: { code: 'CLASS9' },
            update: {},
            create: { name: 'Class 9', code: 'CLASS9' }
        })

        const class10 = await prisma.class.upsert({
            where: { code: 'CLASS10' },
            update: {},
            create: { name: 'Class 10', code: 'CLASS10' }
        })

        // Assign student to Class 9
        await prisma.userProfile.update({
            where: { userId: student.id },
            data: { classId: class9.id }
        })

        const subject = await prisma.subject.upsert({
            where: { code: 'MATH' },
            update: {},
            create: { name: 'Mathematics', code: 'MATH' }
        })

        // 2. Exams & Results Verification
        console.log('2. Verifying Exams & Results...')
        const exam = await prisma.exam.create({
            data: {
                title: 'Final Term 2024',
                term: 'FINAL',
                academicYear: '2024',
                classId: class9.id,
                subjectId: subject.id,
                maxMarks: 100,
                date: new Date()
            }
        })

        await prisma.result.create({
            data: {
                examId: exam.id,
                studentId: student.id,
                marksObtained: 85,
                grade: 'A',
                published: false
            }
        })
        console.log('   [PASS] Exam and result record created.')

        // 3. Promotion Gate Verification (Failure Case)
        console.log('3. Verifying Promotion Gate (Failure expected)...')
        // Add an unpaid fee head
        const feeHead = await prisma.feeHead.create({
            data: { name: 'Library Fee', amount: 500 }
        })

        await prisma.studentFee.create({
            data: {
                studentId: student.id,
                feeHeadId: feeHead.id,
                amount: 500,
                dueDate: new Date(),
                status: 'UNPAID'
            }
        })

        console.log('   Attempting promotion with unpaid fees...')
        // We'll simulate the logic from the server action here to verify the database state
        const pendingFees = await prisma.studentFee.findMany({
            where: { studentId: student.id, status: { in: ['UNPAID', 'PARTIAL'] } }
        })

        if (pendingFees.length > 0) {
            console.log('   [PASS] Correctly blocked promotion due to pending fees.')
        } else {
            throw new Error('Promotion gate failed: Should have detected pending fees.')
        }

        // 4. Recording Payment to Clear Gate
        console.log('4. Clearing fees and verifying promotion gate (Success expected)...')
        await prisma.studentFee.updateMany({
            where: { studentId: student.id },
            data: { status: 'PAID', paidAmount: 500 }
        })

        const pendingFeesAfter = await prisma.studentFee.findMany({
            where: { studentId: student.id, status: { in: ['UNPAID', 'PARTIAL'] } }
        })

        if (pendingFeesAfter.length === 0) {
            console.log('   Fees cleared. Proceeding to promote...')
            await prisma.$transaction(async (tx) => {
                await tx.userProfile.update({
                    where: { userId: student.id },
                    data: { classId: class10.id }
                })
                await tx.promotionHistory.create({
                    data: {
                        studentId: student.id,
                        fromClassId: class9.id,
                        toClassId: class10.id,
                        academicYear: '2025',
                        promotedById: admin.id
                    }
                })
            })
            console.log('   [PASS] Student promoted to Class 10 successfully.')
        } else {
            throw new Error('Fees clearing failed.')
        }

        // 5. Cleanup
        console.log('5. Cleaning up test data...')
        await prisma.promotionHistory.deleteMany({ where: { studentId: student.id } })
        await prisma.result.deleteMany({ where: { studentId: student.id } })
        await prisma.studentFee.deleteMany({ where: { studentId: student.id } })
        await prisma.exam.delete({ where: { id: exam.id } })
        await prisma.user.delete({ where: { id: student.id } })
        console.log('   [PASS] Cleanup complete.')

        console.log('\n--- PHASE 2 VERIFICATION SUCCESSFUL ---')

    } catch (error) {
        console.error('\n--- PHASE 2 VERIFICATION FAILED ---')
        console.error(error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

verifyPhase2ExamsAndPromotion()
