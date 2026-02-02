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
    const isActive = item.route === '/admin'
        ? pathname === '/admin'
        : pathname === item.route || pathname.startsWith(item.route + '/')
    const hasChildren = item.children && item.children.length > 0

    return (
        <div className="space-y-0.5">
            <div
                className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer group select-none",
                    isActive
                        ? "bg-slate-50 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    depth > 0 && "ml-4"
                )}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
            >
                {Icon && <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700")} />}

                {hasChildren ? (
                    <span className="flex-1 truncate">{t(item.labelKey)}</span>
                ) : (
                    <Link href={item.route} className="flex-1 truncate">
                        {t(item.labelKey)}
                    </Link>
                )}

                {/* Badge Placeholders (if any) */}
                {isActive && !hasChildren && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}

                {hasChildren && (
                    <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
                )}
            </div>

            {hasChildren && isOpen && (
                <div className="space-y-0.5 mt-0.5">
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
