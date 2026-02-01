'use server'

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/lib/rbac/rbac"
import { revalidatePath } from "next/cache"
import { DEFAULT_NAV } from "../customization/defaults"

import { createAuditLog } from "./audit-helper"


export async function getMenuItems() {
    const session = await auth()
    if (!hasPermission(session, 'settings.branding')) {
        throw new Error("Unauthorized")
    }

    const items = await prisma.menuItem.findMany({
        include: { children: true },
        orderBy: { order: 'asc' }
    })

    // If empty, we might want to "bootstrap" from defaults for the UI
    return items
}

export async function bootstrapMenu() {
    const session = await auth()
    if (!hasPermission(session, 'settings.branding')) return { error: "Unauthorized" }

    const count = await prisma.menuItem.count()
    if (count > 0) return { error: "Menu already bootstrapped" }

    for (const item of DEFAULT_NAV) {
        await prisma.menuItem.create({
            data: {
                key: item.key,
                labelKey: item.labelKey,
                route: item.route,
                iconKey: item.iconKey,
                order: item.order,
                permissionRequired: (item as any).permissionRequired
            }
        })
    }

    await createAuditLog("MENU_BOOTSTRAP", "ui_menu_items", { count: DEFAULT_NAV.length })
    revalidatePath("/admin/settings/customization")
    return { success: true }
}

export async function toggleMenuItemVisibility(roleId: string, menuItemId: string, isVisible: boolean) {
    const session = await auth()
    if (!hasPermission(session, 'settings.branding')) return { error: "Unauthorized" }

    await prisma.roleMenuOverride.upsert({
        where: {
            roleId_menuItemId: { roleId, menuItemId }
        },
        update: { isVisible },
        create: { roleId, menuItemId, isVisible }
    })

    await createAuditLog("MENU_VISIBILITY_TOGGLE", "ui_role_menu_overrides", { roleId, menuItemId, isVisible })
    revalidatePath("/admin/settings/customization")
    return { success: true }
}

export async function updateMenuItemOrder(menuItemId: string, newOrder: number) {
    const session = await auth()
    if (!hasPermission(session, 'settings.branding')) return { error: "Unauthorized" }

    await prisma.menuItem.update({
        where: { id: menuItemId },
        data: { order: newOrder }
    })

    await createAuditLog("MENU_ORDER_UPDATE", "ui_menu_items", { menuItemId, newOrder })
    revalidatePath("/admin/settings/customization")
    return { success: true }
}
