import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { isRateLimited } from "@/lib/utils/rate-limit"
import { env } from "@/lib/env"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60,    // 24 hours
    },
    cookies: {
        sessionToken: {
            name: `${env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: env.NODE_ENV === "production",
            },
        },
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Basic Rate Limiting for Login
                if (credentials?.email && typeof credentials.email === 'string') {
                    if (isRateLimited(`login:${credentials.email}`, { limit: 5, windowMs: 15 * 60 * 1000 })) {
                        throw new Error("Too many login attempts. Please try again later.")
                    }
                }

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (!parsedCredentials.success) {
                    return null
                }

                const { email, password } = parsedCredentials.data

                const user = await prisma.user.findUnique({
                    where: { email },
                })

                if (!user) return null

                const passwordsMatch = await bcrypt.compare(password, user.passwordHash)
                if (!passwordsMatch) return null

                return {
                    id: user.id,
                    email: user.email,
                    name: user.fullName,
                }
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user, trigger, session }) {
            if (user) {
                // Initial sign in
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    include: {
                        roles: {
                            include: { role: true }
                        }
                    }
                })

                if (dbUser) {
                    token.roles = dbUser.roles.map(r => r.role.name)
                    token.id = dbUser.id
                }
            }
            return token
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub

                // Fetch extended user details (roles, permissions) here for client availability
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: token.sub },
                        include: {
                            roles: {
                                include: {
                                    role: {
                                        include: { rolePermissions: { include: { permission: true } } }
                                    }
                                }
                            }
                        }
                    })

                    if (dbUser) {
                        const perms = new Set<string>()
                        dbUser.roles.forEach(ur => {
                            ur.role.rolePermissions.forEach(rp => {
                                perms.add(rp.permission.slug)
                            })
                        })

                        // Add to session 
                        // @ts-ignore
                        session.user.permissions = Array.from(perms)
                        // @ts-ignore
                        session.user.roles = dbUser.roles.map(r => r.role.name)
                        // @ts-ignore
                        session.user.roleIds = dbUser.roles.map(r => r.role.id)
                    }
                } catch (error) {
                    console.error("Error fetching user permissions", error)
                }
            }
            return session
        }
    }
})







