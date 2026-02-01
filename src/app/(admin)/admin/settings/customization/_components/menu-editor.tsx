'use client'

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { ICON_MAP } from "@/lib/customization/defaults"
import { bootstrapMenu, toggleMenuItemVisibility } from "@/lib/actions/menu-actions"
import { useTranslation } from "@/lib/i18n/i18n-provider"
import { toast } from "sonner"
import { Loader2, RefreshCw, Eye, EyeOff } from "lucide-react"

export function MenuEditor({ initialMenuItems, roles }: { initialMenuItems: any[], roles: any[] }) {
    const { t } = useTranslation()
    const [isPending, startTransition] = useTransition()
    const [selectedRole, setSelectedRole] = useState(roles[0]?.id)

    const handleBootstrap = () => {
        startTransition(async () => {
            const res = await bootstrapMenu()
            if (res.success) toast.success(t('common.save'))
            else toast.error(res.error || t('common.error'))
        })
    }

    const handleToggle = (menuItemId: string, isVisible: boolean) => {
        startTransition(async () => {
            const res = await toggleMenuItemVisibility(selectedRole, menuItemId, isVisible)
            if (res.success) toast.success(t('common.save'))
            else toast.error(res.error || t('common.error'))
        })
    }

    if (initialMenuItems.length === 0) {
        return (
            <Card className="border-none shadow-sm ring-1 ring-slate-200">
                <CardContent className="pt-16 pb-16 text-center space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                        <RefreshCw className="h-8 w-8 text-primary/40" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">{t('admin.settings.customization.menu.noItems')}</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                            {t('admin.settings.customization.menu.bootstrapDesc')}
                        </p>
                    </div>
                    <Button onClick={handleBootstrap} disabled={isPending} className="px-8 shadow-lg shadow-primary/20">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('admin.settings.customization.bootstrap')}
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-sm font-semibold text-slate-500">{t('admin.settings.customization.menu.visibilityFor')}</span>
                <select
                    className="flex h-10 w-[240px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium shadow-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.displayName}</option>
                    ))}
                </select>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="w-[300px] font-semibold text-slate-700">{t('admin.settings.customization.menu.table.item')}</TableHead>
                                <TableHead className="font-semibold text-slate-700">{t('admin.settings.customization.menu.table.route')}</TableHead>
                                <TableHead className="font-semibold text-slate-700">{t('admin.settings.customization.menu.table.permission')}</TableHead>
                                <TableHead className="text-right font-semibold text-slate-700">{t('admin.settings.customization.menu.table.visible')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialMenuItems.map((item) => {
                                const Icon = ICON_MAP[item.iconKey]
                                const override = item.roleOverrides?.find((o: any) => o.roleId === selectedRole)
                                const isVisible = override ? override.isVisible : true

                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border">
                                                    {Icon && <Icon className="h-4 w-4 text-slate-600" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{t(item.labelKey)}</span>
                                                    <span className="text-[10px] font-mono text-muted-foreground uppercase">{item.key}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-mono text-slate-500">
                                            {item.route}
                                        </TableCell>
                                        <TableCell>
                                            {item.permissionRequired ? (
                                                <Badge variant="secondary" className="text-[10px] font-mono tracking-tight bg-slate-100 text-slate-600 border-none rounded-md px-1.5 py-0.5">
                                                    {item.permissionRequired}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-medium italic">{t('admin.settings.customization.menu.public')}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {isVisible ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-slate-300" />}
                                                <Switch
                                                    checked={isVisible}
                                                    onCheckedChange={(checked) => handleToggle(item.id, checked)}
                                                    disabled={isPending}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
