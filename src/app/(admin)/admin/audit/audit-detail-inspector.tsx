'use client'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, History, Database, Globe } from "lucide-react"

interface AuditDetailInspectorProps {
    log: any
}

export function AuditDetailInspector({ log }: AuditDetailInspectorProps) {
    const details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details
    const metadata = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold text-slate-400 hover:text-indigo-600">
                    Inspect
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl border-l-0 bg-slate-50/50">
                <SheetHeader className="pb-6 border-b bg-white -mx-6 px-6 pt-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg text-white shadow-lg ${log.accessType === 'MUTATION' ? 'bg-indigo-600 shadow-indigo-100' :
                                log.accessType === 'EXPORT' ? 'bg-amber-600 shadow-amber-100' :
                                    log.accessType === 'VIEW' ? 'bg-blue-600 shadow-blue-100' :
                                        'bg-rose-600 shadow-rose-100'
                            }`}>
                            <History className="h-4 w-4" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl font-black text-slate-900 tracking-tight">{log.action}</SheetTitle>
                            <SheetDescription className="text-xs font-bold font-mono text-slate-400 uppercase tracking-tighter">
                                ID: {log.id}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 flex items-center gap-2">
                            <Database className="h-3 w-3" /> Event context
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resource</p>
                                <p className="text-xs font-black text-slate-900">{log.resource}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Type</p>
                                <p className="text-xs font-black text-slate-900">{log.accessType}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actor</p>
                                <p className="text-xs font-black text-slate-900">{log.user?.fullName || 'System'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</p>
                                <p className="text-xs font-black text-slate-900">{new Date(log.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Diffs/Details */}
                    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-800">
                        <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <Search className="h-3 w-3 text-indigo-400" /> Mutation details & metadata
                            </h4>
                        </div>
                        <div className="p-4 overflow-auto max-h-[500px]">
                            <pre className="text-[11px] font-mono text-indigo-200/90 leading-relaxed">
                                {JSON.stringify({ details, metadata }, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {metadata?.diff && (
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                                <Globe className="h-3 w-3" /> State delta
                            </h4>
                            <div className="grid gap-4">
                                <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-3">
                                    <p className="text-[9px] font-black text-rose-600 uppercase mb-1">Pre-transaction (Before)</p>
                                    <pre className="text-[10px] font-mono text-slate-600">{JSON.stringify(metadata.diff.before, null, 2)}</pre>
                                </div>
                                <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
                                    <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Post-transaction (After)</p>
                                    <pre className="text-[10px] font-mono text-slate-600">{JSON.stringify(metadata.diff.after, null, 2)}</pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
