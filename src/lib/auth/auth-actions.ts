'use server'

import { signIn } from '@/lib/auth/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const email = formData.get('email') as string

        // Sign in with credentials
        await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        })

        // If successful, fetch user role and redirect accordingly
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: { role: true }
                }
            }
        })

        if (user && user.roles.length > 0) {
            const primaryRole = user.roles[0].role.name

            // Redirect based on role
            if (primaryRole === 'SCHOOL_ADMIN') {
                redirect('/admin')
            } else if (primaryRole === 'TEACHER') {
                redirect('/teacher')
            } else if (primaryRole === 'STUDENT') {
                redirect('/student')
            } else if (primaryRole === 'GUARDIAN') {
                redirect('/guardian')
            }
        }

        // Default redirect if no specific role
        redirect('/admin')

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






