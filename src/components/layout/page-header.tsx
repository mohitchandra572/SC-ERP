import { cn } from "@/lib/ui/cn"

interface PageHeaderProps {
    title: string
    description?: string
    actions?: React.ReactNode
    children?: React.ReactNode
    className?: string
    variant?: 'default' | 'hero'
}

/**
 * Page header with title, optional description, and action buttons
 */
export function PageHeader({ title, description, actions, children, className, variant = 'default' }: PageHeaderProps) {
    const headerActions = actions || children;

    if (variant === 'hero') {
        return (
            <div className={cn("relative py-24 px-4 text-center space-y-6 mb-16 rounded-[3rem] overflow-hidden border border-slate-200/60 shadow-xl", className)}>
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/50 to-slate-50 opacity-90" />
                <div className="absolute inset-0 mesh-gradient-premium opacity-10" />

                <div className="relative z-10 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black font-bengali tracking-tight text-slate-900">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
                            {description}
                        </p>
                    )}
                    {headerActions && (
                        <div className="flex items-center justify-center gap-4 pt-6">
                            {headerActions}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10 pb-6 border-b border-slate-100", className)}>
            <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 font-bengali">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm font-medium text-slate-500 max-w-2xl leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
            {headerActions && (
                <div className="flex items-center gap-4">
                    {headerActions}
                </div>
            )}
        </div>
    )
}
