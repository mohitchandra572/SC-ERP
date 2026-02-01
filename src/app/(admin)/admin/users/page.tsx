import { getUsers, assignRole, removeRole } from "@/lib/actions/user-actions"
import { getRoles } from "@/lib/actions/role-actions"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getServerTranslation } from "@/lib/i18n/server"

export default async function UsersPage() {
    const users = await getUsers()
    const { t } = await getServerTranslation()

    return (
        <PageShell>
            <PageHeader
                title={t('admin.users.title')}
                description={t('admin.users.description')}
            >
                <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t('admin.users.addUser')}
                </Button>
            </PageHeader>

            <div className="mb-6 flex gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users by name or email..." className="pl-9" />
                </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="font-semibold text-slate-700">{t('admin.users.table.user')}</TableHead>
                                <TableHead className="font-semibold text-slate-700">{t('admin.users.table.email')}</TableHead>
                                <TableHead className="font-semibold text-slate-700">{t('admin.users.table.roles')}</TableHead>
                                <TableHead className="font-semibold text-slate-700">{t('admin.users.table.status')}</TableHead>
                                <TableHead className="text-right font-semibold text-slate-700">{t('admin.users.table.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.fullName}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {user.roles.map((ur: any) => (
                                                <Badge key={ur.roleId} variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                                                    {ur.role.displayName}
                                                </Badge>
                                            ))}
                                            {user.roles.length === 0 && (
                                                <span className="text-xs text-muted-foreground italic">{t('admin.users.noRoles')}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.isActive ? "success" : "destructive"} className="rounded-full px-2.5">
                                            {user.isActive ? t('admin.users.active') : t('admin.users.inactive')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 hover:bg-slate-100 font-medium">
                                            {t('admin.users.editRoles')}
                                        </Button>
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
