import { CloudinaryProvider } from './cloudinary.provider'
import { PrivateStorageProvider } from './private.provider'
import { StorageProvider } from './types'

class StorageService {
    private cloudinary = new CloudinaryProvider()
    private privateStorage = new PrivateStorageProvider()

    getProvider(type: 'cloudinary' | 'private'): StorageProvider {
        return type === 'cloudinary' ? this.cloudinary : this.privateStorage
    }

    /**
     * Unified upload method that selects provider based on resource sensitivity
     */
    async upload(file: Buffer | string, category: 'media' | 'document', options?: any) {
        // Business logic for provider selection
        const providerType = category === 'media' ? 'cloudinary' : 'private'
        const provider = this.getProvider(providerType)

        return provider.upload(file, options)
    }
}

export const storage = new StorageService()
export * from './types'
