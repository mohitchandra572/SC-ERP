'use server'

import { prisma } from "@/lib/db"
import { settingsSchema } from "@/lib/validations/settings"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"
import { createAuditLog } from "./audit-helper"


export async function updateSettings(prevState: any, formData: FormData) {
    const session = await auth()
    if (!hasPermission(session, 'settings.branding')) {
        return { error: "Unauthorized" }
    }

    const rawData = Object.fromEntries(formData.entries())
    const parsed = settingsSchema.safeParse(rawData)

    if (!parsed.success) {
        console.error(parsed.error)
        return { error: "Invalid data" }
    }

    const data = parsed.data

    const first = await prisma.schoolSettings.findFirst()

    if (first) {
        await prisma.schoolSettings.update({
            where: { id: first.id },
            data
        })
    } else {
        await prisma.schoolSettings.create({
            data: { ...data, schoolNameBn: data.schoolNameBn } // ensure requireds
        })
    }

    revalidatePath("/")
    await createAuditLog("SETTINGS_UPDATE", "school_settings", { data })
    return { success: true, message: "Settings updated" }
}







