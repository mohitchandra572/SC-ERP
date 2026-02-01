import fs from 'fs/promises'
import path from 'path'
import { StorageProvider, StorageUploadOptions, StorageUploadResult } from './types'

/**
 * Local Private Storage Provider (Stub for S3/R2)
 * In production, this would be replaced with an S3 compatible provider.
 */
export class PrivateStorageProvider implements StorageProvider {
    private storageDir = path.join(process.cwd(), 'storage/private')

    constructor() {
        this.ensureDirExists()
    }

    private async ensureDirExists() {
        try {
            await fs.access(this.storageDir)
        } catch {
            await fs.mkdir(this.storageDir, { recursive: true })
        }
    }

    async upload(file: Buffer | string, options?: StorageUploadOptions): Promise<StorageUploadResult> {
        await this.ensureDirExists()

        const filename = options?.publicId || `${Date.now()}-${Math.random().toString(36).slice(2)}`
        const filePath = path.join(this.storageDir, filename)

        const buffer = Buffer.isBuffer(file) ? file : Buffer.from(file)
        await fs.writeFile(filePath, buffer)

        return {
            key: filename,
            provider: 'private'
        }
    }

    async getPublicUrl(key: string): Promise<string | null> {
        // Private documents never have public URLs
        return null
    }

    async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
        /**
         * STUB: In a real S3 implementation, this would return a pre-signed URL.
         * For local dev, we'll return an internal proxy route.
         */
        return `/api/storage/private/${key}?expires=${Math.floor(Date.now() / 1000) + expiresIn}`
    }

    async delete(key: string): Promise<void> {
        try {
            await fs.unlink(path.join(this.storageDir, key))
        } catch (e) {
            console.error(`Failed to delete local file: ${key}`, e)
        }
    }
}
