'use client'

import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { useTranslation } from "@/lib/i18n/i18n-provider"

export function AuditLogs({ logs }: { logs: any[] }) {
    const { t } = useTranslation()

    if (logs.length === 0) {
        return (
            <div className="p-16 text-center text-slate-400 border-2 border-dashed rounded-xl bg-slate-50/50">
                {t('admin.settings.customization.audit.noLogs')}
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                            <TableHead className="py-4">{t('admin.settings.customization.audit.table.user')}</TableHead>
                            <TableHead className="py-4">{t('admin.settings.customization.audit.table.action')}</TableHead>
                            <TableHead className="py-4">{t('admin.settings.customization.audit.table.resource')}</TableHead>
                            <TableHead className="py-4">{t('admin.settings.customization.audit.table.details')}</TableHead>
                            <TableHead className="text-right py-4">{t('admin.settings.customization.audit.table.timestamp')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-900 leading-tight">{log.user?.fullName || 'System'}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{log.user?.email || '-'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge variant="secondary" className="px-1.5 py-0 h-5 font-mono text-[10px] bg-slate-100 text-slate-600 border-none rounded-md">
                                        {log.action}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-slate-600 font-mono py-4">
                                    {log.resource}
                                </TableCell>
                                <TableCell className="py-4">
                                    <pre className="text-[10px] text-slate-500 max-w-[200px] overflow-hidden truncate bg-slate-50 p-1.5 rounded border border-slate-100">
                                        {JSON.stringify(log.details)}
                                    </pre>
                                </TableCell>
                                <TableCell className="text-right text-xs text-slate-500 font-medium py-4">
                                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
