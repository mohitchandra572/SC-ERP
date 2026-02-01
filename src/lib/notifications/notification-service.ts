import { prisma } from "@/lib/db"
import { NotificationType, SmsStatus } from "@prisma/client"

export interface SmsProvider {
    send(to: string, message: string): Promise<{ success: boolean; providerResponse?: string; providerName: string }>
}

export class MockSmsProvider implements SmsProvider {
    async send(to: string, message: string) {
        console.log(`[MockSMS] Sending to ${to}: ${message}`)
        return { success: true, providerName: 'MockProvider', providerResponse: 'OK' }
    }
}

/**
 * Production-ready HTTP SMS Provider (Universal)
 */
export class GenericHttpSmsProvider implements SmsProvider {
    constructor(
        private apiUrl: string,
        private apiKey: string,
        private senderId: string
    ) { }

    async send(to: string, message: string) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: this.apiKey,
                    senderid: this.senderId,
                    number: to,
                    message: message
                })
            })

            const data = await response.json()
            return {
                success: response.ok,
                providerName: 'GenericHttp',
                providerResponse: JSON.stringify(data)
            }
        } catch (error) {
            return { success: false, providerName: 'GenericHttp', providerResponse: String(error) }
        }
    }
}

export const notificationService = {
    /**
     * Sends an in-app notification
     */
    async sendInApp(userId: string, title: string, content: string, type: NotificationType = 'SYSTEM') {
        return await prisma.notification.create({
            data: {
                userId,
                title,
                content,
                type,
                isRead: false
            }
        })
    },

    /**
     * Queues an SMS for delivery (Outbox Pattern)
     */
    async queueSms(phoneNumber: string, content: string, scheduledAt?: Date) {
        return await prisma.smsOutbox.create({
            data: {
                phoneNumber,
                content,
                status: 'PENDING',
                scheduledAt
            }
        })
    },

    /**
     * Process the SMS outbox (to be called by a worker or triggered after mutation)
     */
    async processOutbox(provider?: SmsProvider) {
        // Resolve provider from settings if not provided
        let activeProvider = provider
        if (!activeProvider) {
            const settings = await prisma.schoolSettings.findFirst()
            activeProvider = process.env.NODE_ENV === 'production'
                ? new GenericHttpSmsProvider(process.env.SMS_API_URL!, process.env.SMS_API_KEY!, 'SCHOOL')
                : new MockSmsProvider()
        }

        const MAX_RETRIES = 5
        const BASE_DELAY_MINUTES = 5

        const pendingSms = await prisma.smsOutbox.findMany({
            where: {
                status: 'PENDING',
                retryCount: { lt: MAX_RETRIES },
                OR: [
                    { scheduledAt: null },
                    { scheduledAt: { lte: new Date() } }
                ],
                AND: [
                    {
                        OR: [
                            { nextRetryAt: null },
                            { nextRetryAt: { lte: new Date() } }
                        ]
                    }
                ]
            },
            take: 50,
            orderBy: { createdAt: 'asc' }
        })

        for (const sms of pendingSms) {
            const smsAny = sms as any
            try {
                const result = await activeProvider.send(smsAny.phoneNumber, smsAny.content)

                if (result.success) {
                    await prisma.smsOutbox.update({
                        where: { id: smsAny.id },
                        data: {
                            status: 'SENT',
                            sentAt: new Date(),
                            provider: result.providerName,
                            providerResponse: result.providerResponse
                        }
                    })
                } else {
                    throw new Error(result.providerResponse || 'Provider rejected request')
                }
            } catch (error: any) {
                const nextRetryCount = (smsAny.retryCount || 0) + 1
                const isDead = nextRetryCount >= MAX_RETRIES

                // Exponential backoff: base * 2 ^ (retryCount)
                const backoffMinutes = BASE_DELAY_MINUTES * Math.pow(2, nextRetryCount - 1)
                const nextRetryAt = new Date(Date.now() + backoffMinutes * 60000)

                await prisma.smsOutbox.update({
                    where: { id: smsAny.id },
                    data: {
                        status: isDead ? 'FAILED' : 'PENDING',
                        retryCount: nextRetryCount,
                        lastError: String(error.message || error),
                        nextRetryAt: isDead ? null : nextRetryAt,
                        providerResponse: String(error)
                    }
                })

                console.error(`SMS failure [${smsAny.id}]: Retry ${nextRetryCount}/${MAX_RETRIES}. Next: ${nextRetryAt.toISOString()}`)
            }
        }
    }
}
