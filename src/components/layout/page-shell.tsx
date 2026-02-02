'use client'

import { cn } from "@/lib/ui/cn"
import { motion } from "framer-motion"

interface PageShellProps {
    children: React.ReactNode
    className?: string
}

/**
 * Page wrapper component that provides consistent padding and max-width with entry animation
 */
export function PageShell({ children, className }: PageShellProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn("container mx-auto px-4 py-6 md:px-6 md:py-8", className)}
        >
            {children}
        </motion.div>
    )
}
