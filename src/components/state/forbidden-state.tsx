'use client'

import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/ui/cn"

interface ForbiddenStateProps {
    message?: string
    backLink?: string
    backLabel?: string
    className?: string
}

/**
 * Forbidden (403) state component for unauthorized access
 */
export function ForbiddenState({
    message = "You don't have permission to access this page",
    backLink = "/",
    backLabel = "Go Back",
    className
}: ForbiddenStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-12 px-4 text-center min-h-[400px]",
            className
        )}>
            <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">
                Access Denied
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                {message}
            </p>
            <Button asChild variant="outline">
                <Link href={backLink}>
                    {backLabel}
                </Link>
            </Button>
        </div>
    )
}
