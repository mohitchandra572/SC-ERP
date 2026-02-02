import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/state/empty-state";
import { Bell } from "lucide-react";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import locales from "@/lib/i18n/locales/bn.json";

export async function generateMetadata() {
    return generateSEOMetadata({
        title: locales.seo.notices.title,
        description: locales.seo.notices.description,
        path: '/notices',
        locale: 'bn',
    });
}

export default function NoticesPage() {
    return (
        <PageShell>
            <PageHeader
                title="নোটিশ বোর্ড"
                description="সর্বশেষ ঘোষণা, পরীক্ষার সময়সূচী ও গুরুত্বপূর্ণ তথ্য"
                variant="hero"
            />
            <EmptyState
                icon={<Bell className="h-12 w-12" />}
                title="কোনো নোটিশ নেই"
                description="বর্তমানে কোনো নোটিশ প্রকাশিত হয়নি। নতুন ঘোষণার জন্য শীঘ্রই ফিরে আসুন।"
            />
        </PageShell>
    );
}
