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
import { cn } from "@/lib/ui/cn"

export function MenuEditor({ initialMenuItems, roles }: { initialMenuItems: any[], roles: any[] }) {
    const { t } = useTranslation()
    const [isPending, startTransition] = useTransition()
    const [selectedRole, setSelectedRole] = useState(roles[0]?.id)

    const handleBootstrap = (force = false) => {
        startTransition(async () => {
            const res = await bootstrapMenu(force)
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
            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white/50 backdrop-blur-sm">
                <CardContent className="pt-20 pb-20 text-center space-y-8">
                    <div className="mx-auto w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <RefreshCw className="h-10 w-10 text-primary/40" />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-black text-slate-900 font-bengali">{t('admin.settings.customization.menu.noItems')}</h3>
                        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
                            {t('admin.settings.customization.menu.bootstrapDesc')}
                        </p>
                    </div>
                    <Button onClick={() => handleBootstrap(false)} disabled={isPending} className="px-10 h-12 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
                        {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {t('admin.settings.customization.bootstrap')}
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="stat-icon-container !h-10 !w-10 bg-slate-900 text-white shrink-0">
                        <Eye className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Configuring Visibility</p>
                        <select
                            className="bg-transparent text-sm font-black text-slate-900 outline-none cursor-pointer hover:text-primary transition-colors pr-8"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            {roles.map(role => (
                                <option key={role.id} value={role.id} className="font-sans font-medium text-slate-700">{role.displayName}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBootstrap(true)}
                    disabled={isPending}
                    className="gap-3 font-bold text-slate-500 hover:text-primary hover:bg-primary/5 px-6 rounded-xl transition-all h-10 border border-transparent hover:border-primary/10"
                >
                    <RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />
                    {t('admin.settings.customization.bootstrap')}
                </Button>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60 rounded-[2rem] overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                                <TableHead className="py-5 px-8 font-black text-[11px] uppercase tracking-widest text-slate-400">{t('admin.settings.customization.menu.table.item')}</TableHead>
                                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-400">{t('admin.settings.customization.menu.table.route')}</TableHead>
                                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-400">{t('admin.settings.customization.menu.table.permission')}</TableHead>
                                <TableHead className="text-right px-8 font-black text-[11px] uppercase tracking-widest text-slate-400">{t('admin.settings.customization.menu.table.visible')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialMenuItems.map((item) => {
                                const Icon = ICON_MAP[item.iconKey]
                                const override = item.roleOverrides?.find((o: any) => o.roleId === selectedRole)
                                const isVisible = override ? override.isVisible : true

                                return (
                                    <TableRow key={item.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50 last:border-0 group">
                                        <TableCell className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                    {Icon && <Icon className="h-5 w-5 text-slate-600 group-hover:text-primary transition-colors" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">{t(item.labelKey)}</span>
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{item.key}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs font-bold text-slate-400 font-mono italic">
                                            {item.route}
                                        </TableCell>
                                        <TableCell>
                                            {item.permissionRequired ? (
                                                <Badge variant="secondary" className="text-[10px] font-bold tracking-tight bg-slate-100/50 text-slate-500 border-none rounded-lg px-2 py-0.5">
                                                    {item.permissionRequired}
                                                </Badge>
                                            ) : (
                                                <span className="text-[10px] text-slate-300 font-black uppercase tracking-wider">{t('admin.settings.customization.menu.public')}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right px-8">
                                            <div className="flex items-center justify-end gap-3">
                                                <Switch
                                                    checked={isVisible}
                                                    onCheckedChange={(checked) => handleToggle(item.id, checked)}
                                                    disabled={isPending}
                                                    className="data-[state=checked]:bg-primary"
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
        </div >
    )
}
