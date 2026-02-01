import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="max-w-md w-full border-slate-200 shadow-xl shadow-slate-500/5 text-center">
                <CardHeader className="pb-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <FileQuestion className="h-6 w-6 text-slate-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Page not found</CardTitle>
                    <CardDescription>
                        The page you are looking for doesn't exist or has been moved.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-3">
                        <Link href="/" className="w-full">
                            <Button className="w-full bg-slate-900">
                                <Home className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
