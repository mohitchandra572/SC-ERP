"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"
import { storage } from "@/lib/storage"
import { revalidatePath } from "next/cache"
import { DocumentType } from "@prisma/client"
import { auditService } from "@/lib/audit/audit-service"

/**
 * Upload the institutional school logo to Cloudinary
 */
export async function uploadSchoolLogo(formData: FormData) {
    const session = await auth()
    if (!hasPermission(session, 'storage.settings.manage')) throw new Error("Unauthorized")

    const file = formData.get('logo') as File
    if (!file) throw new Error("No file uploaded")

    const buffer = Buffer.from(await file.arrayBuffer())

    // Logos always go to Cloudinary (media)
    const uploadResult = await storage.upload(buffer, 'media', {
        folder: 'institutional/branding',
        publicId: 'school-logo',
        isPublic: true
    })

    await prisma.schoolSettings.updateMany({
        data: {
            logoUrl: uploadResult.publicUrl
        }
    })

    await auditService.logMutation("school_settings", "UPDATE", { field: 'logoUrl', value: uploadResult.publicUrl })
    revalidatePath("/")

    return { success: true, url: uploadResult.publicUrl }
}

/**
 * Update the storage policy for a specific document type
 */
export async function updateStoragePolicy(docType: DocumentType, provider: 'cloudinary' | 'private') {
    const session = await auth()
    if (!hasPermission(session, 'storage.settings.manage')) throw new Error("Unauthorized")

    await prisma.storagePolicy.upsert({
        where: { docType },
        update: { storageProvider: provider },
        create: { docType, storageProvider: provider }
    })

    await auditService.logMutation("institutional_storage_policies", "UPSERT", { docType, provider })
    revalidatePath("/admin/settings/storage")

    return { success: true }
}

/**
 * Get all storage policies
 */
export async function getStoragePolicies() {
    const session = await auth()
    if (!hasPermission(session, 'storage.settings.manage')) throw new Error("Unauthorized")

    return await prisma.storagePolicy.findMany()
}
