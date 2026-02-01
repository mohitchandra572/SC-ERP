import { getRoles } from "@/lib/actions/role-actions"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, MoreHorizontal, Trash2, Plus } from "lucide-react"
import { getServerTranslation } from "@/lib/i18n/server"

export default async function RolesPage() {
    const roles = await getRoles()
    const { t } = await getServerTranslation()

    return (
        <PageShell>
            <PageHeader
                title={t('admin.roles.title')}
                description={t('admin.roles.description')}
            >
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('admin.roles.addRole')}
                </Button>
            </PageHeader>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="w-[200px] font-semibold text-slate-700">{t('admin.roles.table.role')}</TableHead>
                                <TableHead className="font-semibold text-slate-700">{t('admin.roles.table.permissions')}</TableHead>
                                <TableHead className="font-semibold text-slate-700">{t('admin.roles.table.type')}</TableHead>
                                <TableHead className="text-right font-semibold text-slate-700">{t('admin.roles.table.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role: any) => (
                                <TableRow key={role.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900">{role.displayName}</span>
                                            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{role.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-md">
                                            {role.rolePermissions.slice(0, 5).map((rp: any) => (
                                                <Badge key={rp.permissionId} variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                                                    {rp.permission.slug}
                                                </Badge>
                                            ))}
                                            {role.rolePermissions.length > 5 && (
                                                <Badge variant="outline" className="text-[10px] bg-slate-50">
                                                    {t('admin.roles.more', { count: role.rolePermissions.length - 5 })}
                                                </Badge>
                                            )}
                                            {role.rolePermissions.length === 0 && (
                                                <span className="text-xs text-muted-foreground italic">{t('admin.roles.noPermissions')}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={role.isSystem ? "secondary" : "outline"} className="rounded-full">
                                            {role.isSystem ? t('admin.roles.system') : t('admin.roles.custom')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                            {!role.isSystem && (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </PageShell>
    )
}
