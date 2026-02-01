import { prisma } from "@/lib/db"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, LineChart, PieChart, Download, FileSpreadsheet, FileJson, TrendingUp } from "lucide-react"

export default async function ReportsPage() {
    return (
        <PageShell>
            <PageHeader
                title="Institutional Intelligence"
                description="Advanced analytics and portable data exports for institutional oversight."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <ReportCard
                    title="Financial Health"
                    icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
                    desc="Collection vs Dues analysis"
                    color="emerald"
                />
                <ReportCard
                    title="Academic Trends"
                    icon={<BarChart3 className="h-4 w-4 text-indigo-500" />}
                    desc="Class performance heatmaps"
                    color="indigo"
                />
                <ReportCard
                    title="Attendance Audit"
                    icon={<PieChart className="h-4 w-4 text-amber-500" />}
                    desc="Institutional presence rates"
                    color="amber"
                />
                <ReportCard
                    title="Staff Efficiency"
                    icon={<LineChart className="h-4 w-4 text-rose-500" />}
                    desc="Payroll vs Performance"
                    color="rose"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ExportSection
                    title="Student & Academic Data"
                    description="Export student profiles, results, and promotion history."
                    exports={[
                        { label: "Full Student Registry", format: "CSV" },
                        { label: "Class-wise Results (Term 1)", format: "XLSX" },
                        { label: "Attendance Summary", format: "CSV" }
                    ]}
                />

                <ExportSection
                    title="Financial & HR Data"
                    description="Export fee collections, dues, and staff payroll records."
                    exports={[
                        { label: "Fee Collection Report", format: "CSV" },
                        { label: "Pending Dues Ledger", format: "CSV" },
                        { label: "Annual Payroll Summary", format: "XLSX" }
                    ]}
                />
            </div>
        </PageShell>
    )
}

function ReportCard({ title, icon, desc, color }: any) {
    return (
        <Card className="hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
                        {icon}
                    </div>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
                <p className="text-xs text-slate-500 font-medium">{desc}</p>
            </CardContent>
        </Card>
    )
}

function ExportSection({ title, description, exports }: any) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b bg-slate-50/30">
                <h3 className="font-black text-slate-800 tracking-tight text-lg mb-1">{title}</h3>
                <p className="text-sm text-slate-500 font-medium">{description}</p>
            </div>
            <div className="p-6 flex-1 space-y-4">
                {exports.map((exp: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 hover:bg-white transition-all">
                        <div className="flex items-center gap-3">
                            {exp.format === 'CSV' ? <FileSpreadsheet className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" /> : <FileJson className="h-5 w-5 text-slate-400 group-hover:text-amber-500" />}
                            <span className="font-bold text-slate-700 group-hover:text-slate-900">{exp.label}</span>
                        </div>
                        <Button size="sm" variant="outline" className="gap-2 h-8 font-bold text-[11px] border-slate-200 group-hover:border-indigo-500 group-hover:text-indigo-600">
                            <Download className="h-3 w-3" />
                            {exp.format}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
