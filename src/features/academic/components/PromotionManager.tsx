'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { promoteStudent, bulkPromoteStudents } from '../promotion-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

import { useTranslation } from "@/lib/i18n/i18n-provider"

interface Student {
    id: string
    fullName: string
    rollNo: string | null
    hasPendingFees: boolean
}

interface PromotionManagerProps {
    currentClassId: string
    classes: { id: string, name: string }[]
    students: Student[]
}

export function PromotionManager({ currentClassId, classes, students }: PromotionManagerProps) {
    const { t } = useTranslation()

    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [targetClassId, setTargetClassId] = useState<string>('')
    const [academicYear, setAcademicYear] = useState<string>(new Date().getFullYear() + 1 + '')

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const selectAll = () => {
        setSelectedIds(students.map(s => s.id))
    }

    const handleBulkPromote = () => {
        if (!targetClassId) {
            toast.error("Please select a target class")
            return
        }

        if (selectedIds.length === 0) {
            toast.error("Please select at least one student")
            return
        }

        startTransition(async () => {
            const results = await bulkPromoteStudents(selectedIds, targetClassId, academicYear)
            const successCount = results.filter(r => r.success).length
            const failCount = results.length - successCount

            if (successCount > 0) {
                toast.success(`${successCount} students promoted successfully`)
            }
            if (failCount > 0) {
                toast.error(`${failCount} promotions failed due to pending fees`)
            }

            setSelectedIds([])
            router.refresh()
        })
    }

    return (
        <Card className="border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border-t-4 border-t-indigo-500">
            <CardHeader className="flex flex-row items-center justify-between pb-6 bg-slate-50/30">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-indigo-500" />
                        {t('promotion.title')}
                    </CardTitle>
                    <p className="text-sm text-slate-500 font-medium">Select students eligible for academic transition</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                    <Select value={targetClassId} onChange={(e) => setTargetClassId(e.target.value)} className="h-10 text-xs font-semibold w-[180px]">
                        <option value="">{t('promotion.to_class')}</option>
                        {classes.filter(c => c.id !== currentClassId).map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </Select>
                    <Button
                        onClick={handleBulkPromote}
                        disabled={isPending || selectedIds.length === 0 || !targetClassId}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-indigo-100 shadow-lg transition-all h-10 px-6 font-bold active:scale-95"
                    >
                        {isPending ? t('common.saving') : (
                            <>
                                <TrendingUp className="h-4 w-4" />
                                {t('promotion.promote_button')}
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent bg-slate-50/50">
                            <TableHead className="w-[60px] pl-6">
                                <Checkbox
                                    checked={selectedIds.length === students.length && students.length > 0}
                                    onCheckedChange={selectAll}
                                    className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                />
                            </TableHead>
                            <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">{t('student.name')}</TableHead>
                            <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">{t('student.roll')}</TableHead>
                            <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">{t('promotion.fees_check')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <AlertCircle className="h-10 w-10 text-slate-100" />
                                        <p className="text-slate-400 italic font-medium">{t('tables.noData')}</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => (
                                <TableRow key={student.id} className="hover:bg-indigo-50/30 transition-all duration-200 border-b border-slate-50">
                                    <TableCell className="pl-6 py-4">
                                        <Checkbox
                                            checked={selectedIds.includes(student.id)}
                                            onCheckedChange={() => toggleSelect(student.id)}
                                            disabled={student.hasPendingFees}
                                            className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 transition-colors"
                                        />
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-900 py-4">{student.fullName}</TableCell>
                                    <TableCell className="text-slate-500 font-mono text-xs py-4">
                                        <Badge variant="outline" className="font-mono bg-white border-slate-100 text-slate-400">
                                            {student.rollNo || '---'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        {student.hasPendingFees ? (
                                            <Badge className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 border font-bold px-2.5 py-1 text-[10px] uppercase tracking-wider gap-1.5 animate-in fade-in slide-in-from-right-2 duration-300">
                                                <AlertCircle className="h-3 w-3" />
                                                {t('fees.status_unpaid')}
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 border font-bold px-2.5 py-1 text-[10px] uppercase tracking-wider gap-1.5 animate-in fade-in zoom-in duration-500">
                                                <CheckCircle2 className="h-3 w-3" />
                                                {t('fees.status_paid')}
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
