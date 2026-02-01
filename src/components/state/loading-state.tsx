'use client'

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/ui/cn"

interface LoadingStateProps {
    message?: string
    spinner?: boolean
    className?: string
}

/**
 * Loading state component with optional spinner and message
 */
export function LoadingState({ message, spinner = true, className }: LoadingStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-12 px-4 text-center",
            className
        )}>
            {spinner && (
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            )}
            {message && (
                <p className="text-sm text-muted-foreground">
                    {message}
                </p>
            )}
        </div>
    )
}
