import { prisma } from "@/lib/db"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ScrollText, ShieldAlert, Zap, Search, FilterX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuditDetailInspector } from "./audit-detail-inspector"

export default async function AuditLogPage({
    searchParams
}: {
    searchParams: {
        page?: string,
        actor?: string,
        resource?: string,
        from?: string,
        to?: string
    }
}) {
    const page = Number(searchParams.page) || 1
    const limit = 20
    const skip = (page - 1) * limit

    const where: any = {}
    if (searchParams.actor) where.userId = searchParams.actor
    if (searchParams.resource) where.resource = searchParams.resource
    if (searchParams.from || searchParams.to) {
        where.createdAt = {}
        if (searchParams.from) where.createdAt.gte = new Date(searchParams.from)
        if (searchParams.to) where.createdAt.lte = new Date(searchParams.to)
    }

    const [logs, total, users] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: skip
        }),
        prisma.auditLog.count({ where }),
        prisma.user.findMany({
            where: { roles: { some: { role: { name: { in: ['ADMIN', 'TEACHER'] } } } } },
            select: { id: true, fullName: true }
        })
    ])

    const totalPages = Math.ceil(total / limit)

    return (
        <PageShell>
            <PageHeader
                title="Institutional Audit Trail"
                description="Monitor critical system mutations and data access events for institutional transparency."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-indigo-50/50 border-indigo-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="h-3 w-3" />
                            Active Monitoring
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-black text-slate-900">100%</p>
                        <p className="text-xs text-slate-500 font-medium">Of mutations captured</p>
                    </CardContent>
                </Card>

                <Card className="bg-rose-50/50 border-rose-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert className="h-3 w-3" />
                            Access Control
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-black text-slate-900">{(logs as any[]).filter(l => l.accessType === 'EXPORT').length}</p>
                        <p className="text-xs text-slate-500 font-medium">Export events on this page</p>
                    </CardContent>
                </Card>

                <Card className="bg-emerald-50/50 border-emerald-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                            <ScrollText className="h-3 w-3" />
                            Data Integrity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-black text-slate-900">{total}</p>
                        <p className="text-xs text-slate-500 font-medium">Total log entries recorded</p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="p-4 border-b bg-slate-50/10 flex flex-wrap items-center gap-4">
                    <form className="flex flex-wrap items-center gap-4 w-full">
                        <div className="flex flex-col gap-1.5 min-w-[200px]">
                            <label className="text-[10px] font-black uppercase text-slate-400">Actor</label>
                            <select
                                name="actor"
                                defaultValue={searchParams.actor}
                                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
                            >
                                <option value="">All Actors</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.fullName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5 min-w-[200px]">
                            <label className="text-[10px] font-black uppercase text-slate-400">Resource</label>
                            <input
                                name="resource"
                                placeholder="e.g. academic_results"
                                defaultValue={searchParams.resource}
                                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 min-w-[150px]">
                            <label className="text-[10px] font-black uppercase text-slate-400">From</label>
                            <input
                                type="date"
                                name="from"
                                defaultValue={searchParams.from}
                                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 min-w-[150px]">
                            <label className="text-[10px] font-black uppercase text-slate-400">To</label>
                            <input
                                type="date"
                                name="to"
                                defaultValue={searchParams.to}
                                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>

                        <div className="flex items-end h-full mt-auto">
                            <Button type="submit" size="sm" className="h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold">
                                <Search className="h-3.5 w-3.5 mr-2" />
                                Apply Filters
                            </Button>
                        </div>

                        {(searchParams.actor || searchParams.resource || searchParams.from || searchParams.to) && (
                            <div className="flex items-end h-full mt-auto">
                                <Button variant="ghost" size="sm" className="h-9 text-rose-600 font-bold hover:bg-rose-50" asChild>
                                    <a href="/admin/audit">Clear</a>
                                </Button>
                            </div>
                        )}
                    </form>
                </div>

                <div className="p-6 border-b bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-indigo-100 shadow-lg">
                            <ScrollText className="h-4 w-4" />
                        </div>
                        <h3 className="font-black text-slate-800 tracking-tight">Institutional Activity Log</h3>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-transparent">
                            <TableHead className="pl-6 text-slate-500 font-bold text-[10px] uppercase">User / Target</TableHead>
                            <TableHead className="text-slate-500 font-bold text-[10px] uppercase">Action Type</TableHead>
                            <TableHead className="text-slate-500 font-bold text-[10px] uppercase">Category</TableHead>
                            <TableHead className="text-slate-500 font-bold text-[10px] uppercase">Timestamp</TableHead>
                            <TableHead className="text-right pr-6 text-slate-500 font-bold text-[10px] uppercase">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <Search className="h-10 w-10 text-slate-100" />
                                        <p className="text-slate-400 italic font-medium">The institutional audit trail is currently empty.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log: any) => (
                                <TableRow key={log.id} className="group hover:bg-slate-50/80 transition-all duration-200 border-b border-slate-100/50">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                                                {log.user?.fullName?.[0] || 'S'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{log.user?.fullName || 'System'}</span>
                                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{log.resource}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-black text-slate-800 text-xs tracking-tight">{log.action}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-0
                                            ${log.accessType === 'MUTATION' ? 'bg-indigo-50 text-indigo-600' : ''}
                                            ${log.accessType === 'EXPORT' ? 'bg-amber-50 text-amber-600' : ''}
                                            ${log.accessType === 'VIEW' ? 'bg-blue-50 text-blue-600' : ''}
                                            ${log.accessType === 'ROLLBACK' ? 'bg-rose-50 text-rose-600' : ''}
                                        `}>
                                            {log.accessType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-500 font-medium text-xs">
                                        {format(new Date(log.createdAt), 'dd MMM, HH:mm:ss')}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <AuditDetailInspector log={log} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="p-4 border-t bg-slate-50/30 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">
                        Showing <span className="text-slate-900 font-bold">{skip + 1}-{Math.min(skip + limit, total)}</span> of <span className="text-slate-900 font-bold">{total}</span> entries
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            asChild={page > 1}
                        >
                            {page > 1 ? <a href={`/admin/audit?page=${page - 1}`}>Previous</a> : <span>Previous</span>}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages}
                            asChild={page < totalPages}
                        >
                            {page < totalPages ? <a href={`/admin/audit?page=${page + 1}`}>Next</a> : <span>Next</span>}
                        </Button>
                    </div>
                </div>
            </div>
        </PageShell>
    )
}
