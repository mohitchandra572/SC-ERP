"use client"

import { useTransition } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, FileDown, Play, CheckCircle2, History } from "lucide-react"
import { processPayroll } from "../hr-actions"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface PayrollManagerProps {
    currentMonth: number
    currentYear: number
}

export function PayrollManager({ currentMonth, currentYear }: PayrollManagerProps) {
    const [isPending, startTransition] = useTransition()

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const handleProcess = () => {
        startTransition(async () => {
            const result = await processPayroll(currentMonth, currentYear)
            if (result.success) {
                toast.success(`Payroll processed for ${result.count} staff members.`)
            } else {
                toast.error(result.error || "Failed to process payroll")
            }
        })
    }

    return (
        <Card className="border-slate-200 shadow-sm border-t-4 border-t-indigo-500 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-6 bg-slate-50/50">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-indigo-500" />
                        Payroll Processing
                    </CardTitle>
                    <p className="text-sm text-slate-500 font-medium">
                        Generate monthly salaries and payslips for {monthNames[currentMonth - 1]} {currentYear}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 h-10 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50">
                        <History className="h-4 w-4" />
                        History
                    </Button>
                    <Button
                        onClick={handleProcess}
                        disabled={isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-indigo-100 shadow-lg h-10 px-6 font-bold"
                    >
                        {isPending ? "Processing..." : (
                            <>
                                <Play className="h-4 w-4 fill-current" />
                                Run Payroll
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 flex flex-col items-center text-center space-y-2">
                        <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 mb-2">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <h4 className="font-bold text-slate-800">100% Verified</h4>
                        <p className="text-xs text-slate-500">All staff attendance records are locked for this period.</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 flex flex-col items-center text-center space-y-2">
                        <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mb-2">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <h4 className="font-bold text-slate-800">Budget Safe</h4>
                        <p className="text-xs text-slate-500">Institutional funds cleared for current month disbursements.</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 flex flex-col items-center text-center space-y-2">
                        <div className="bg-amber-100 p-3 rounded-full text-amber-600 mb-2">
                            <FileDown className="h-6 w-6" />
                        </div>
                        <h4 className="font-bold text-slate-800">Auto-Exporter</h4>
                        <p className="text-xs text-slate-500">Payslips will be generated in PDF and queued for email.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
