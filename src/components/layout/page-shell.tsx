import { cn } from "@/lib/ui/cn"

interface PageShellProps {
    children: React.ReactNode
    className?: string
}

/**
 * Page wrapper component that provides consistent padding and max-width
 */
export function PageShell({ children, className }: PageShellProps) {
    return (
        <div className={cn("container mx-auto px-4 py-6 md:px-6 md:py-8", className)}>
            {children}
        </div>
    )
}
