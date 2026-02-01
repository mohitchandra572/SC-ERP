export interface StorageUploadOptions {
    folder?: string
    publicId?: string
    isPublic?: boolean
    resourceType?: 'image' | 'raw' | 'video' | 'auto'
}

export interface StorageUploadResult {
    key: string
    publicUrl?: string
    provider: 'cloudinary' | 'private'
}

export interface StorageProvider {
    upload(file: Buffer | string, options?: StorageUploadOptions): Promise<StorageUploadResult>
    getPublicUrl(key: string): Promise<string | null>
    getSignedUrl(key: string, expiresIn?: number): Promise<string>
    delete(key: string): Promise<void>
}
