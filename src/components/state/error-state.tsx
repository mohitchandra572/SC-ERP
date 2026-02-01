'use client'

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui/cn"

interface ErrorStateProps {
    title?: string
    message?: string
    retry?: () => void
    retryLabel?: string
    className?: string
}

/**
 * Error state component with optional retry action
 */
export function ErrorState({
    title = "Error",
    message = "Something went wrong",
    retry,
    retryLabel = "Try Again",
    className
}: ErrorStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-12 px-4 text-center",
            className
        )}>
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">
                {title}
            </h3>
            {message && (
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    {message}
                </p>
            )}
            {retry && (
                <Button onClick={retry} variant="outline">
                    {retryLabel}
                </Button>
            )}
        </div>
    )
}
