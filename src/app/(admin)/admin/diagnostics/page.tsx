import { prisma } from "@/lib/db"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Clock, RefreshCcw, Trash2, ShieldCheck, Mail, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { retrySms, clearAllFailedSms } from "@/lib/actions/diagnostics-actions"

export default async function DiagnosticsPage() {
    const smsOutbox = await prisma.smsOutbox.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
    })

    const stats = {
        total: smsOutbox.length,
        pending: smsOutbox.filter(s => s.status === 'PENDING').length,
        sent: smsOutbox.filter(s => s.status === 'SENT').length,
        failed: smsOutbox.filter(s => s.status === 'FAILED').length,
    }

    return (
        <PageShell>
            <PageHeader
                title="System Diagnostics"
                description="Infrastructure monitoring and reliable communication management."
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total SMS" value={stats.total} icon={<Mail className="h-4 w-4" />} color="blue" />
                <StatCard title="Pending" value={stats.pending} icon={<Clock className="h-4 w-4" />} color="amber" />
                <StatCard title="Sent" value={stats.sent} icon={<CheckCircle2 className="h-4 w-4" />} color="emerald" />
                <StatCard title="Failed" value={stats.failed} icon={<AlertCircle className="h-4 w-4" />} color="rose" />
            </div>

            <Card className="rounded-2xl border-slate-200 overflow-hidden shadow-sm">
                <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                        <CardTitle className="text-lg font-black tracking-tight">Communication Outbox</CardTitle>
                    </div>
                    {stats.failed > 0 && (
                        <form action={clearAllFailedSms}>
                            <Button variant="destructive" size="sm" className="gap-2 h-8 font-bold">
                                <Trash2 className="h-4 w-4" />
                                Clear Failed
                            </Button>
                        </form>
                    )}
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHead className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="pl-6 font-bold text-[10px] uppercase text-slate-500">Recipient</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase text-slate-500">Status</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase text-slate-500">Retries</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase text-slate-500">Last Error</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase text-slate-500">Next Retry</TableHead>
                                <TableHead className="pr-6 text-right font-bold text-[10px] uppercase text-slate-500">Actions</TableHead>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {smsOutbox.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-400 italic">No communication logs found.</TableCell>
                                </TableRow>
                            ) : (
                                smsOutbox.map((sms: any) => (
                                    <TableRow key={sms.id} className="group hover:bg-slate-50/80 transition-all border-b border-slate-100/50">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{sms.phoneNumber}</span>
                                                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">{sms.content}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`
                                                text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-0
                                                ${sms.status === 'SENT' ? 'bg-emerald-50 text-emerald-600' : ''}
                                                ${sms.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : ''}
                                                ${sms.status === 'FAILED' ? 'bg-rose-50 text-rose-600' : ''}
                                            `}>
                                                {sms.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-slate-500">
                                            {sms.retryCount || 0}/5
                                        </TableCell>
                                        <TableCell className="text-[10px] text-rose-500 font-medium max-w-[150px] truncate">
                                            {sms.lastError || '-'}
                                        </TableCell>
                                        <TableCell className="text-[10px] text-slate-500">
                                            {sms.nextRetryAt ? format(new Date(sms.nextRetryAt), 'HH:mm:ss') : '-'}
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            {sms.status !== 'SENT' && (
                                                <form action={retrySms.bind(null, sms.id)}>
                                                    <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                        <RefreshCcw className="h-3 w-3 mr-1" />
                                                        Retry
                                                    </Button>
                                                </form>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </PageShell>
    )
}

function StatCard({ title, value, icon, color }: any) {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
    }
    return (
        <Card className={`${colors[color]} border shadow-none`}>
            <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-white/50`}>{icon}</div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{title}</p>
                    <p className="text-xl font-black">{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}
