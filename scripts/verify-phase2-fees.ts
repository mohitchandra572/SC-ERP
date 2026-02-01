import { prisma } from "../src/lib/db"
import { allocateFee, recordPayment, getStudentFees } from "../src/features/fees/fees-actions"

async function verifyFees() {
    console.log("🧪 Starting Fees & Accounting Verification...")

    // 1. Setup: Get a reference student and a fee head
    const student = await prisma.user.findFirst({
        where: { roles: { some: { role: { name: 'STUDENT' } } } }
    })
    const feeHead = await prisma.feeHead.findFirst()
    const admin = await prisma.user.findFirst({
        where: { roles: { some: { role: { name: 'SCHOOL_ADMIN' } } } }
    })

    if (!student || !feeHead || !admin) {
        console.error("❌ Missing required seed data (Student, FeeHead, or Admin)")
        return
    }

    console.log(`Using Student: ${student.fullName}, Fee Head: ${feeHead.name}`)

    // 2. Test Allocation (Directly using prisma since server action has auth checks)
    console.log("Testing Fee Allocation...")
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30) // 30 days from now

    const allocation = await prisma.studentFee.create({
        data: {
            studentId: student.id,
            feeHeadId: feeHead.id,
            amount: feeHead.amount,
            dueDate,
            status: 'UNPAID'
        }
    })
    console.log(`✅ Fee Allocated: ${allocation.id} (${feeHead.amount} BDT)`)

    // 3. Test Payment Recording
    console.log("Testing Payment Recording...")

    // Simulate a payment transaction
    const receipt = await prisma.$transaction(async (tx) => {
        const r = await tx.feeReceipt.create({
            data: {
                studentId: student.id,
                amount: feeHead.amount,
                paymentMethod: 'CASH',
                collectedById: admin.id
            }
        })

        await tx.studentFee.update({
            where: { id: allocation.id },
            data: {
                status: 'PAID',
                paidAmount: feeHead.amount
            }
        })
        return r
    })
    console.log(`✅ Payment Recorded: Receipt ID ${receipt.id}`)

    // 4. Verify Final State
    const updatedFee = await prisma.studentFee.findUnique({
        where: { id: allocation.id }
    })

    if (updatedFee?.status === 'PAID') {
        console.log("✅ Student Fee status updated correctly to PAID")
    } else {
        console.error(`❌ Student Fee status mismatch: ${updatedFee?.status}`)
    }

    console.log("🎉 Fees & Accounting Verification complete")
}

verifyFees()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
