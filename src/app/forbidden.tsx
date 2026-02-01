import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ShieldAlert, Home, LogOut } from 'lucide-react'

export default function Forbidden() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="max-w-md w-full border-orange-100 shadow-xl shadow-orange-500/5 text-center">
                <CardHeader className="pb-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                        <ShieldAlert className="h-6 w-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Access Denied</CardTitle>
                    <CardDescription>
                        You don't have permission to access this resource.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-sm text-orange-800 mb-4">
                        If you believe this is a mistake, please contact your school administrator.
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/" className="w-full">
                            <Button variant="outline" className="w-full border-slate-200">
                                <Home className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/login" className="w-full">
                            <Button className="w-full bg-slate-900">
                                <LogOut className="mr-2 h-4 w-4" />
                                Change User
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
