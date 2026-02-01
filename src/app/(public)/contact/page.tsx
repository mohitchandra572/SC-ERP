import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import locales from "@/lib/i18n/locales/bn.json";

export async function generateMetadata() {
    return generateSEOMetadata({
        title: locales.seo.contact.title,
        description: locales.seo.contact.description,
        path: '/contact',
        locale: 'bn',
    });
}

export default function ContactPage() {
    return (
        <PageShell>
            <PageHeader
                title="যোগাযোগ"
                description="আমাদের সাথে যোগাযোগ করুন"
            />
            <div className="prose max-w-none">
                <p className="text-muted-foreground">
                    এই পৃষ্ঠাটি শীঘ্রই আসছে। এখানে যোগাযোগের তথ্য, ঠিকানা, ফোন নম্বর এবং যোগাযোগ ফর্ম প্রদর্শিত হবে।
                </p>
            </div>
        </PageShell>
    );
}
