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
                description="মানসম্মত শিক্ষা ও নৈতিক মূল্যবোধের বিকাশে আমরা প্রতিশ্রুতিবদ্ধ"
                variant="hero"
            />

            <div className="grid md:grid-cols-3 gap-8 mb-16">
                {[
                    { title: 'আমাদের লক্ষ্য', desc: 'শিক্ষার্থীদের আধুনিক প্রযুক্তিনির্ভর ও নৈতিক শিক্ষায় সুনাগরিক হিসেবে গড়ে তোলা।', icon: '🎯', color: 'bg-blue-50 text-blue-600' },
                    { title: 'আমাদের ভিশন', desc: 'একটি বৈষম্যহীন ডিজিটাল শিক্ষাঙ্গন নিশ্চিত করা যা আগামীর নেতৃত্ব দেবে।', icon: '👁️‍🗨️', color: 'bg-emerald-50 text-emerald-600' },
                    { title: 'আমাদের মূলনীতি', desc: 'সততা, শৃঙ্খলা এবং পরিশ্রমের মাধ্যমে প্রতিটি সাফল্যের শিখরে পৌঁছানো।', icon: '💎', color: 'bg-amber-50 text-amber-600' },
                ].map((item, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl border border-slate-200/50 shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                        <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-3xl mb-6 shadow-sm`}>
                            {item.icon}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4 font-bengali">{item.title}</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-white/70 backdrop-blur-xl p-12 mb-16 rounded-3xl border border-slate-200/50 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -z-10" />
                <div className="max-w-3xl">
                    <h2 className="text-3xl font-black text-slate-900 mb-6 font-bengali">প্রতিষ্ঠানের ইতিহাস</h2>
                    <p className="text-slate-600 leading-relaxed text-lg font-medium space-y-4">
                        আমাদের এই প্রিয় শিক্ষা প্রতিষ্ঠানটি দীর্ঘ ৩০ বছর ধরে শিক্ষার আলো ছড়িয়ে যাচ্ছে। স্থানীয় সুধী সমাজের ঐকান্তিক প্রচেষ্টায় প্রতিষ্ঠিত এই বিদ্যালয়টি আজ অঞ্চলের অন্যতম শ্রেষ্ঠ শিক্ষা প্রতিষ্ঠানে পরিণত হয়েছে।
                        <br /><br />
                        আমরা বিশ্বাস করি শিক্ষা শুধু পুঁথিগত জ্ঞান নয়, বরং শিক্ষার্থীর সুপ্ত প্রতিভা বিকাশের একটি নিরন্তর প্রক্রিয়া। সেই লক্ষ্যেই আমরা আমাদের প্রতিটি পদক্ষেপ গ্রহণ করি।
                    </p>
                </div>
            </div>
        </PageShell>
    );
}
