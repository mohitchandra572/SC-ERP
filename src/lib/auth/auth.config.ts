import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user

            const isProtected =
                nextUrl.pathname.startsWith('/admin') ||
                nextUrl.pathname.startsWith('/teacher') ||
                nextUrl.pathname.startsWith('/student') ||
                nextUrl.pathname.startsWith('/guardian')

            if (isProtected) {
                if (!isLoggedIn) return false

                // RBAC Protection
                const roles = (auth.user as any)?.roles || []

                if (nextUrl.pathname.startsWith('/admin')) {
                    if (!roles.includes('SCHOOL_ADMIN')) {
                        return Response.redirect(new URL('/forbidden', nextUrl))
                    }
                }

                // Add logic for other roles if needed

                return true
            }
            return true
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                // We'll need to fetch roles here during sign-in to put them in the JWT
                // However, since auth.config is shared, we should ideally handle 
                // data fetching in a place where we have DB access.
                // For now, let's just make sure it's shaped for session compatibility.
            }
            return token
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        }
    },
    providers: [],
} satisfies NextAuthConfig






