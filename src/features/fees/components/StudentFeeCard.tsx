'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FeeStatus } from "@prisma/client"
import { format } from "date-fns"
import { useTranslation } from "@/lib/i18n/i18n-provider"

interface StudentFee {
    id: string
    feeHead: {
        name: string
        amount: number
    }
    dueDate: Date
    status: FeeStatus
    amount: number
    paidAmount: number
}

interface StudentFeeCardProps {
    fees: StudentFee[]
}

export function StudentFeeCard({ fees }: StudentFeeCardProps) {
    const { t } = useTranslation()

    const totalDues = fees.reduce((acc, f) => f.status === 'UNPAID' || f.status === 'PARTIAL' ? acc + (f.amount - f.paidAmount) : acc, 0)

    const getStatusVariant = (status: FeeStatus) => {
        switch (status) {
            case 'PAID': return 'success'
            case 'UNPAID': return 'destructive'
            case 'PARTIAL': return 'warning'
            case 'WAIVED': return 'secondary'
            default: return 'outline'
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('fees.my_fees') || 'My Fees & Dues'}</CardTitle>
                <div className="text-right">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t('fees.total_payable') || 'Total Payable'}</p>
                    <p className="text-2xl font-bold text-primary">{totalDues.toLocaleString()} BDT</p>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('fees.head') || 'Fee Description'}</TableHead>
                            <TableHead>{t('fees.due_date') || 'Due Date'}</TableHead>
                            <TableHead>{t('fees.amount') || 'Amount'}</TableHead>
                            <TableHead className="text-right">{t('fees.status') || 'Status'}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fees.map((fee) => (
                            <TableRow key={fee.id}>
                                <TableCell className="font-medium">{fee.feeHead.name}</TableCell>
                                <TableCell className="text-slate-500">{format(new Date(fee.dueDate), 'dd MMM yyyy')}</TableCell>
                                <TableCell>{fee.amount.toLocaleString()} BDT</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={getStatusVariant(fee.status)}>
                                        {t(`fees.status_${fee.status.toLowerCase()}`) || fee.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
