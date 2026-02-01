import { cn } from "@/lib/ui/cn"

interface FormActionsProps {
    children: React.ReactNode
    className?: string
    align?: 'left' | 'right' | 'center'
}

/**
 * Form actions wrapper for submit/cancel buttons
 */
export function FormActions({ children, className, align = 'right' }: FormActionsProps) {
    return (
        <div className={cn(
            "flex items-center gap-2 pt-6 border-t",
            align === 'left' && "justify-start",
            align === 'center' && "justify-center",
            align === 'right' && "justify-end",
            className
        )}>
            {children}
        </div>
    )
}
