import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import locales from "@/lib/i18n/locales/bn.json";

export async function generateMetadata() {
    return generateSEOMetadata({
        title: locales.seo.about.title,
        description: locales.seo.about.description,
        path: '/about',
        locale: 'bn',
    });
}

export default function AboutPage() {
    return (
        <PageShell>
            <PageHeader
                title="আমাদের সম্পর্কে"
                description="আমাদের প্রতিষ্ঠান, ইতিহাস এবং শিক্ষাগত মূল্যবোধ"
            />
            <div className="prose max-w-none">
                <p className="text-muted-foreground">
                    এই পৃষ্ঠাটি শীঘ্রই আসছে। এখানে প্রতিষ্ঠানের ইতিহাস, মিশন, ভিশন এবং মূল্যবোধ প্রদর্শিত হবে।
                </p>
            </div>
        </PageShell>
    );
}
