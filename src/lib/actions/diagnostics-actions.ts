"use server"

import { prisma } from "@/lib/db"
import { notificationService } from "@/lib/notifications/notification-service"
import { auth } from "@/lib/auth/auth"
import { revalidatePath } from "next/cache"

export async function retrySms(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const sms = await prisma.smsOutbox.findUnique({
        where: { id }
    })

    if (!sms) throw new Error("SMS not found")

    // Reset status and retry count to trigger immediate processing
    await prisma.smsOutbox.update({
        where: { id },
        data: {
            status: 'PENDING',
            retryCount: 0,
            nextRetryAt: null
        } as any
    })

    // Trigger processing
    await notificationService.processOutbox()

    revalidatePath("/admin/diagnostics")
}

export async function clearAllFailedSms() {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await prisma.smsOutbox.deleteMany({
        where: { status: 'FAILED' }
    })

    revalidatePath("/admin/diagnostics")
}
