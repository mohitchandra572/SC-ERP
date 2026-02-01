import { v2 as cloudinary } from 'cloudinary'
import { StorageProvider, StorageUploadOptions, StorageUploadResult } from './types'
import { env } from '@/lib/env'

// Configure Cloudinary from env
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true
})

export class CloudinaryProvider implements StorageProvider {
    async upload(file: Buffer | string, options?: StorageUploadOptions): Promise<StorageUploadResult> {
        const fileContent = Buffer.isBuffer(file)
            ? `data:image/png;base64,${file.toString('base64')}`
            : file

        const result = await cloudinary.uploader.upload(fileContent, {
            folder: options?.folder || 'school-erp',
            public_id: options?.publicId,
            resource_type: options?.resourceType || 'auto',
            access_mode: options?.isPublic ? 'public' : 'authenticated'
        })

        return {
            key: result.public_id,
            publicUrl: result.secure_url,
            provider: 'cloudinary'
        }
    }

    async getPublicUrl(key: string): Promise<string | null> {
        return cloudinary.url(key, { secure: true })
    }

    async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
        // Cloudinary signed URLs for private assets
        return cloudinary.utils.private_download_url(key, 'pdf', {
            expires_at: Math.floor(Date.now() / 1000) + expiresIn
        })
    }

    async delete(key: string): Promise<void> {
        await cloudinary.uploader.destroy(key)
    }
}
