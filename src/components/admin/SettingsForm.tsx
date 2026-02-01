'use client'

import { useActionState, useState } from 'react'
import { updateSettings } from '@/lib/actions/settings-actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/lib/i18n/i18n-provider"
import { FormSection } from "@/components/forms/form-section"
import { FormActions } from "@/components/forms/form-actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
    const { t } = useTranslation()
    const [state, formAction, isPending] = useActionState(updateSettings, null)
    const [primaryColor, setPrimaryColor] = useState(initialSettings?.primaryColor || "#0f172a")

    return (
        <form action={formAction} className="space-y-8 pb-12">
            <FormSection
                title={t('admin.settings.branding.organization')}
                description={t('admin.settings.branding.description')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="schoolNameBn" className="text-slate-700 font-semibold">{t('admin.settings.branding.schoolNameBn')}</Label>
                        <Input id="schoolNameBn" name="schoolNameBn" defaultValue={initialSettings?.schoolNameBn} required className="bg-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="schoolNameEn" className="text-slate-700 font-semibold">{t('admin.settings.branding.schoolNameEn')}</Label>
                        <Input id="schoolNameEn" name="schoolNameEn" defaultValue={initialSettings?.schoolNameEn} required className="bg-white" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="primaryColor" className="text-slate-700 font-semibold">{t('admin.settings.branding.primaryColor')}</Label>
                        <div className="flex gap-3 items-center">
                            <div
                                className="w-10 h-10 rounded-xl border border-slate-200 shadow-sm shrink-0 ring-offset-2 ring-1 ring-slate-100"
                                style={{ backgroundColor: primaryColor }}
                            />
                            <Input
                                name="primaryColor"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="font-mono bg-white"
                                placeholder="#0f172a"
                            />
                            <Input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-12 h-10 p-1 cursor-pointer bg-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-semibold">{t('admin.settings.branding.email')}</Label>
                        <Input id="email" name="email" type="email" defaultValue={initialSettings?.email} required className="bg-white" />
                    </div>
                </div>
            </FormSection>

            <FormSection
                title={t('admin.settings.branding.contact')}
                description={t('admin.settings.branding.description')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700 font-semibold">{t('admin.settings.branding.phone')}</Label>
                        <Input id="phone" name="phone" defaultValue={initialSettings?.phone} required className="bg-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="addressBn" className="text-slate-700 font-semibold">{t('admin.settings.branding.addressBn')}</Label>
                        <Input id="addressBn" name="addressBn" defaultValue={initialSettings?.addressBn} required className="bg-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="addressEn" className="text-slate-700 font-semibold">{t('admin.settings.branding.addressEn')}</Label>
                        <Input id="addressEn" name="addressEn" defaultValue={initialSettings?.addressEn} required className="bg-white" />
                    </div>
                </div>
            </FormSection>

            <FormSection
                title={t('admin.settings.branding.legal')}
                description={t('admin.settings.branding.description')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="footerTextBn" className="text-slate-700 font-semibold">{t('admin.settings.branding.footerTextBn')}</Label>
                        <Input id="footerTextBn" name="footerTextBn" defaultValue={initialSettings?.footerTextBn} required className="bg-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="footerTextEn" className="text-slate-700 font-semibold">{t('admin.settings.branding.footerTextEn')}</Label>
                        <Input id="footerTextEn" name="footerTextEn" defaultValue={initialSettings?.footerTextEn} required className="bg-white" />
                    </div>
                </div>
            </FormSection>

            <FormActions align="right">
                <Button type="submit" size="lg" disabled={isPending} className="shadow-lg shadow-primary/20 px-8">
                    {isPending ? t('common.loading') : t('common.save')}
                </Button>
            </FormActions>

            {state?.success && (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 animate-in fade-in slide-in-from-bottom-2">
                    {t('common.save')}
                </div>
            )}
            {state?.error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 animate-in fade-in slide-in-from-bottom-2">
                    {state.error || t('common.error')}
                </div>
            )}
        </form>
    )
}

