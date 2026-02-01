import { PublicHeader } from "@/components/layout/public-header"
import { PublicFooter } from "@/components/layout/public-footer"
import { getSchoolSettings } from "@/lib/branding/branding"

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const settings = await getSchoolSettings()

    return (
        <div className="flex min-h-screen flex-col">
            <PublicHeader settings={settings} />
            <div className="flex-1">
                {children}
            </div>
            <PublicFooter settings={settings} />
        </div>
    )
}
