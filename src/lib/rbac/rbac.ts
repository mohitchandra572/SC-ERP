import { Session } from "next-auth"

export function hasPermission(session: Session | null, permission: string): boolean {
    if (!session || !session.user) return false
    const userPerms = (session.user as any).permissions as string[] | undefined
    if (!userPerms) return false
    return userPerms.includes(permission)
}






