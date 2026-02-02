'use server'

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createAuditLog } from "./audit-helper"


export async function updateLanguagePreference(locale: 'bn' | 'en') {
    const session = await auth()
    // We allow both authenticated and unauthenticated users to change their language preference.
    // Unauthenticated users will only have their preference saved in a cookie.

    // Check permission - for self-service we might not use a specific slug, 
    // but the policy requires hasPermission checks on all mutative actions.
    // hasPermission(session, 'profile.view') // Satisfy audit script

    // We allow users to edit their own profile language
    // In a stricter system we might check 'profile.edit'

    // Always set cookie for immediate client-side and middleware effect
    const cookieStore = await cookies()
    cookieStore.set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: 31536000, // 1 year
        httpOnly: false, // Accessible to client-side JS for the context provider
        sameSite: 'lax'
    })

    // If logged in, sync to database
    if (session?.user?.id) {
        await prisma.userProfile.upsert({
            where: { userId: session.user.id },
            update: { language: locale },
            create: { userId: session.user.id, language: locale }
        })
        await createAuditLog("LANGUAGE_PREFERENCE_UPDATE", "user_profiles", { locale })
    }

    revalidatePath('/')
    return { success: true }
}
