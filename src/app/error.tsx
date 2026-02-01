'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="max-w-md w-full border-red-100 shadow-xl shadow-red-500/5">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Something went wrong</CardTitle>
                    <CardDescription>
                        An unexpected error occurred. Our team has been notified.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 mb-6">
                        <p className="text-xs font-mono text-red-800 break-all">
                            {error.message || "Unknown error"}
                            {error.digest && <span className="block mt-1 opacity-60">Digest: {error.digest}</span>}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => reset()}
                            className="w-full border-slate-200"
                        >
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Try again
                        </Button>
                        <Link href="/" className="w-full">
                            <Button className="w-full bg-slate-900">
                                <Home className="mr-2 h-4 w-4" />
                                Go home
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
