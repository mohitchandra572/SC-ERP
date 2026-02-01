import { prisma } from "@/lib/db"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Settings2 } from "lucide-react"

export default async function SalaryGradesPage() {
    const grades = await prisma.salaryGrade.findMany()

    return (
        <PageShell>
            <PageHeader
                title="Salary Grades"
                description="Define institutional pay scales and allowance structures."
            />

            <div className="flex justify-end mb-6">
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                    <Plus className="h-4 w-4" />
                    New Grade
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grades.length === 0 ? (
                    <div className="col-span-full h-48 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                        No salary grades defined yet.
                    </div>
                ) : (
                    grades.map((grade: any) => (
                        <div key={grade.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-slate-900 text-lg">{grade.name}</h3>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400">
                                    <Settings2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Base Salary</span>
                                <span className="text-2xl font-black text-indigo-600">{grade.baseSalary.toLocaleString()} <span className="text-sm font-medium">BDT</span></span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Medical</span>
                                    <span className="text-sm font-bold text-slate-700">{grade.medical.toLocaleString()}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Housing</span>
                                    <span className="text-sm font-bold text-slate-700">{grade.housing.toLocaleString()}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Transport</span>
                                    <span className="text-sm font-bold text-slate-700">{grade.transport.toLocaleString()}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Other</span>
                                    <span className="text-sm font-bold text-slate-700">{grade.otherAllow.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </PageShell>
    )
}
