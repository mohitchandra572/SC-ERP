import { getSchoolSettings } from "@/lib/branding/branding"
import { generateSEOMetadata, generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo/metadata"
import { Hero } from "@/components/home/Hero"
import { Features } from "@/components/home/Features"
import { Statistics } from "@/components/home/Statistics"
import { PrincipalMessage } from "@/components/home/PrincipalMessage"
import { HomeCTA } from "@/components/home/HomeCTA"
import { NoticeContact } from "@/components/home/NoticeContact"
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

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-bold">স্কুল সেটিংস পাওয়া যায়নি।</p>
      </div>
    )
  }

  const organizationSchema = await generateOrganizationSchema()
  const websiteSchema = await generateWebSiteSchema()

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Section */}
      <Hero
        schoolNameBn={settings.schoolNameBn || 'আদর্শ উচ্চ বিদ্যালয়'}
        schoolNameEn={settings.schoolNameEn || 'Ideal High School'}
      />

      <Features />

      <Statistics />

      <PrincipalMessage />

      <HomeCTA />

      <NoticeContact />

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
