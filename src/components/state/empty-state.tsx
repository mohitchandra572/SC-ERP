'use client'

import { cn } from "@/lib/ui/cn"

interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: React.ReactNode
    className?: string
}

/**
 * Empty state component for when there's no data to display
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-12 px-4 text-center",
            className
        )}>
            {icon && (
                <div className="mb-4 text-muted-foreground">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    {description}
                </p>
            )}
            {action && (
                <div>
                    {action}
                </div>
            )}
        </div>
    )
}
