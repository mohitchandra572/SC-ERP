import { getSchoolSettings } from "@/lib/branding/branding"
import SettingsForm from "@/components/admin/SettingsForm"
import { PageShell } from "@/components/layout/page-shell"
import { PageHeader } from "@/components/layout/page-header"
import { getServerTranslation } from "@/lib/i18n/server"

export default async function BrandingSettingsPage() {
    const settings = await getSchoolSettings()
    const { t } = await getServerTranslation()

    return (
        <PageShell>
            <PageHeader
                title={t('admin.settings.branding.title')}
                description={t('admin.settings.branding.description')}
            />
            <div className="max-w-5xl">
                <SettingsForm initialSettings={settings} />
            </div>
        </PageShell>
    )
}
