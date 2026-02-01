import { cn } from "@/lib/ui/cn"

interface PageHeaderProps {
    title: string
    description?: string
    actions?: React.ReactNode
    children?: React.ReactNode
    className?: string
}

/**
 * Page header with title, optional description, and action buttons
 */
export function PageHeader({ title, description, actions, children, className }: PageHeaderProps) {
    const headerActions = actions || children;
    return (
        <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8", className)}>
            <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-slate-900">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-slate-500 max-w-2xl">
                        {description}
                    </p>
                )}
            </div>
            {headerActions && (
                <div className="flex items-center gap-3">
                    {headerActions}
                </div>
            )}
        </div>
    )
}
