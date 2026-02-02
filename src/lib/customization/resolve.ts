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

    // Deduplicate and resolve
    const seenKeys = new Set<string>()
    const resolved = itemsToProcess.map((item: any): ResolvedMenuItem | null => {
        // Deduplication
        if (seenKeys.has(item.key)) return null
        seenKeys.add(item.key)

        if (item.permissionRequired && !hasPermission(session, item.permissionRequired as any)) {
            return null
        }

        // ... visibility overrides logic ...
        // If there is an override for ANY of the user's roles that says "isVisible: true", we show it.
        // If there are overrides and ALL represent "isVisible: false", we hide it.
        // If there are no overrides for the user's roles, default is visible.

        const overrides = item.roleOverrides || []

        // If no overrides exist for this user's roles at all, it's visible by default
        if (overrides.length === 0) {
            // keep visible
        } else {
            // Check if at least one role explicitly allows it (or if checking simply for 'hidden' status)
            // Current logic: Admin Dashboard usually hides items via override.
            // If we have an override saying "false", and no override saying "true", it's hidden.
            const hasVisibleOverride = overrides.some((o: any) => o.isVisible)

            // If we have overrides, but none say "true" (meaning all present overrides say "false"), then hide.
            if (!hasVisibleOverride) {
                return null
            }
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
        .sort((a, b) => {
            // Force Dashboard to top
            if (a.key === 'dashboard') return -1
            if (b.key === 'dashboard') return 1
            return (a as any).order - (b as any).order
        })

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
