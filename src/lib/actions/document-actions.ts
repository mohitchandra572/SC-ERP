"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"
import { storage } from "@/lib/storage"
import { revalidatePath } from "next/cache"
import { auditService } from "@/lib/audit/audit-service"
import { DocumentType } from "@prisma/client"

/**
 * Upload a document using the storage abstraction layer
 */
export async function uploadDocument(formData: FormData, ownerMetadata: { type: string, id: string }) {
    const session = await auth()
    if (!hasPermission(session, 'documents.upload')) throw new Error("Unauthorized")

    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const docType = formData.get('docType') as DocumentType

    if (!file || !title || !docType) throw new Error("Missing required fields")

    const buffer = Buffer.from(await file.arrayBuffer())

    // Fetch storage policy for this doc type
    const policy = await prisma.storagePolicy.findUnique({
        where: { docType }
    })

    const providerType = (policy?.storageProvider as 'cloudinary' | 'private') || 'private'
    const category = providerType === 'cloudinary' ? 'media' : 'document'

    const uploadResult = await storage.upload(buffer, category, {
        folder: `docs/${ownerMetadata.type}`,
        publicId: `${ownerMetadata.id}-${Date.now()}`
    })

    const document = await prisma.document.create({
        data: {
            title,
            docType,
            ownerType: ownerMetadata.type,
            ownerId: ownerMetadata.id,
            storageProvider: uploadResult.provider,
            storageKey: uploadResult.key,
            publicUrl: uploadResult.publicUrl,
            uploadedById: session!.user!.id!
        }
    })

    await auditService.logMutation("institutional_documents", "CREATE", null, { id: document.id, title })
    revalidatePath("/admin/documents")

    return { success: true, id: document.id }
}

/**
 * Get a secure URL for a document (Signed URL for private, Public/Signed for Cloudinary)
 */
export async function getDocumentUrl(documentId: string) {
    const session = await auth()
    if (!hasPermission(session, 'documents.download')) throw new Error("Unauthorized")

    const document = await prisma.document.findUnique({
        where: { id: documentId }
    })

    if (!document) throw new Error("Document not found")

    // Log the access
    await prisma.documentAccessLog.create({
        data: {
            documentId,
            userId: session!.user!.id!,
            action: 'download'
        }
    })

    const providerType = document.storageProvider as 'cloudinary' | 'private'
    const provider = storage.getProvider(providerType)

    if (providerType === 'private') {
        return await provider.getSignedUrl(document.storageKey)
    }

    return document.publicUrl || await provider.getPublicUrl(document.storageKey) || ''
}

/**
 * Delete a document
 */
export async function deleteDocument(documentId: string) {
    const session = await auth()
    if (!hasPermission(session, 'documents.manage')) throw new Error("Unauthorized")

    const document = await prisma.document.findUnique({
        where: { id: documentId }
    })

    if (!document) throw new Error("Document not found")

    const providerType = document.storageProvider as 'cloudinary' | 'private'
    const provider = storage.getProvider(providerType)
    await provider.delete(document.storageKey)

    await prisma.document.delete({
        where: { id: documentId }
    })

    await auditService.logMutation("institutional_documents", "DELETE", { id: documentId, title: document.title }, null)
    revalidatePath("/admin/documents")

    return { success: true }
}

/**
 * Get access logs for a specific document
 */
export async function getDocumentAccessLogs(documentId: string) {
    const session = await auth()
    if (!hasPermission(session, 'reports.view')) throw new Error("Unauthorized")

    return await prisma.documentAccessLog.findMany({
        where: { documentId },
        include: { user: true },
        orderBy: { timestamp: 'desc' }
    })
}
