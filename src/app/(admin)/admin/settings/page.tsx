import Link from "next/link"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Palette, ShieldCheck, Lock, Globe } from "lucide-react"

const settingTabs = [
    {
        title: "Branding",
        description: "School name, logo, and theme colors",
        href: "/admin/settings/branding",
        icon: Palette,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        title: "Roles",
        description: "Manage system roles and permissions",
        href: "/admin/settings/roles",
        icon: ShieldCheck,
        color: "text-purple-600",
        bg: "bg-purple-50"
    },
    {
        title: "Security",
        description: "Password policies and session settings",
        href: "/admin/settings/security",
        icon: Lock,
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    {
        title: "Localization",
        description: "Default language and date formats",
        href: "/admin/settings/localization",
        icon: Globe,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    }
]

export default function SettingsHubPage() {
    return (
        <PageShell>
            <PageHeader
                title="System Settings"
                description="Manage your school platform configuration and access control."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingTabs.map((tab) => (
                    <Link key={tab.href} href={tab.href}>
                        <Card className="hover:border-primary/50 transition-colors cursor-pointer group h-full">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className={`p-3 rounded-xl ${tab.bg} ${tab.color} group-hover:scale-110 transition-transform`}>
                                    <tab.icon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-xl">{tab.title}</CardTitle>
                                    <CardDescription>{tab.description}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </PageShell>
    )
}
