'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/ui/cn"
import { ICON_MAP } from "@/lib/customization/defaults"
import { useTranslation } from "@/lib/i18n/i18n-provider"
import { ResolvedMenuItem } from "@/lib/customization/resolve"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface NavItemProps {
    item: ResolvedMenuItem
    depth?: number
}

export function NavItem({ item, depth = 0 }: NavItemProps) {
    const pathname = usePathname()
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    const Icon = ICON_MAP[item.iconKey]
    const isActive = pathname === item.route || pathname.startsWith(item.route + '/')
    const hasChildren = item.children && item.children.length > 0

    return (
        <div className="space-y-1">
            <div
                className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group",
                    isActive
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    depth > 0 && "ml-4 text-xs"
                )}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
            >
                {Icon && <Icon className={cn("h-4 w-4 shrink-0 transition-transform", !isActive && "group-hover:scale-110")} />}

                {hasChildren ? (
                    <span className="flex-1">{t(item.labelKey)}</span>
                ) : (
                    <Link href={item.route} className="flex-1">
                        {t(item.labelKey)}
                    </Link>
                )}

                {hasChildren && (
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
                )}
            </div>

            {hasChildren && isOpen && (
                <div className="space-y-1 mt-1">
                    {item.children?.map((child) => (
                        <NavItem key={child.key} item={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    )
}

export function DynamicNav({ items }: { items: ResolvedMenuItem[] }) {
    return (
        <div className="space-y-1">
            {items.map((item) => (
                <NavItem key={item.key} item={item} />
            ))}
        </div>
    )
}
