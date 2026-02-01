import { NoticesPlaceholder, ContactPlaceholder } from "@/components/home/Placeholders"
import { getSchoolSettings } from "@/lib/branding/branding"
import { generateSEOMetadata, generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo/metadata"
import locales from "@/lib/i18n/locales/bn.json"

export async function generateMetadata() {
  return generateSEOMetadata({
    title: locales.seo.home.title,
    description: locales.seo.home.description,
    path: '/',
    locale: 'bn',
  });
}

export default async function Home() {
  const settings = await getSchoolSettings()

  // Generate structured data
  const organizationSchema = await generateOrganizationSchema();
  const websiteSchema = await generateWebSiteSchema();

  return (
    <div className="flex flex-col gap-12 py-12 items-center">
      {/* Hero Section */}
      <section className="container px-4 text-center space-y-6 py-12">
        <div className="mx-auto w-24 h-1 bg-primary rounded-full mb-8" />
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          {settings?.schoolNameBn || "Welcome"}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-500 sm:text-xl italic">
          {settings?.schoolNameEn || "School Management System"}
        </p>
        <p className="mx-auto max-w-2xl text-md text-slate-400">
          Excellence in Education, Rooted in Values.
        </p>
      </section>

      {/* Main Content Grid */}
      <section className="container px-4">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-primary pl-4">Latest Notices</h2>
            <NoticesPlaceholder />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-primary pl-4">Get in Touch</h2>
            <ContactPlaceholder />
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </div>
  )
}
