import { prisma } from "@/lib/db"
import { hasPermission } from "@/lib/rbac/rbac"
import { DEFAULT_NAV, DEFAULT_DASHBOARD } from "./defaults"

export interface ResolvedMenuItem {
    key: string
    labelKey: string
    route: string
    iconKey: string
    order: number
    children?: ResolvedMenuItem[]
}

export async function getResolvedNavigation(session: any): Promise<ResolvedMenuItem[]> {
    if (!session?.user) return []

    const userRoleIds = (session.user as any).roleIds || []

    const dbMenuItems = await prisma.menuItem.findMany({
        where: { parentId: null },
        include: {
            roleOverrides: {
                where: { roleId: { in: userRoleIds } }
            },
            children: {
                include: {
                    roleOverrides: {
                        where: { roleId: { in: userRoleIds } }
                    }
                }
            }
        },
        orderBy: { order: 'asc' }
    })

    const itemsToProcess = dbMenuItems.length > 0 ? dbMenuItems : (DEFAULT_NAV as any[])

    const resolved = itemsToProcess.map((item: any): ResolvedMenuItem | null => {
        if (item.permissionRequired && !hasPermission(session, item.permissionRequired as any)) {
            return null
        }

        const overrides = item.roleOverrides || []
        const visibilityOverrides = overrides.filter((o: any) => !o.isVisible)
        if (visibilityOverrides.length === overrides.length && overrides.length > 0) {
            return null
        }

        const children = (item.children || [])
            .map((child: any): ResolvedMenuItem | null => {
                if (child.permissionRequired && !hasPermission(session, child.permissionRequired as any)) {
                    return null
                }
                const childOverrides = child.roleOverrides || []
                const childVisibilityOverrides = childOverrides.filter((o: any) => !o.isVisible)
                if (childVisibilityOverrides.length === childOverrides.length && childOverrides.length > 0) {
                    return null
                }
                return {
                    key: child.key,
                    labelKey: child.labelKey,
                    route: child.route,
                    iconKey: child.iconKey,
                    order: child.order
                }
            })
            .filter((c: any): c is ResolvedMenuItem => c !== null)
            .sort((a: any, b: any) => a.order - b.order)

        return {
            key: item.key,
            labelKey: item.labelKey,
            route: item.route,
            iconKey: item.iconKey,
            order: item.order,
            children: children.length > 0 ? children : undefined
        }
    }).filter((i): i is ResolvedMenuItem => i !== null)
        .sort((a, b) => (a as any).order - (b as any).order)

    return resolved
}

export async function getResolvedDashboard(session: any) {
    if (!session?.user) return DEFAULT_DASHBOARD

    const userRoleIds = (session.user as any).roleIds || []

    const layout = await prisma.dashboardLayout.findFirst({
        where: { roleId: { in: userRoleIds } },
        orderBy: { role: { isSystem: 'desc' } }
    })

    return layout || DEFAULT_DASHBOARD
}
