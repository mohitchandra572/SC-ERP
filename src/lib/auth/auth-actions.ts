'use server'

import { signIn } from '@/lib/auth/auth'
import { AuthError } from 'next-auth'

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        // NextAuth v5 signIn throws error on redirect, so we catch it
        // formData automatically handled by credentials provider if fields match
        await signIn('credentials', formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                case 'CallbackRouteError':
                    return 'Config error or callback failure.'
                default:
                    return 'Something went wrong.'
            }
        }

        // rethrow redirect error so Next.js can handle it
        throw error
    }
}






