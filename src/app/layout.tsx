import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { getSchoolSettings } from "@/lib/branding/branding";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { AuthProvider } from "@/components/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSchoolSettings();
  return {
    title: settings?.schoolNameEn || "School Platform",
    description: "School Management System",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSchoolSettings();
  const primaryColor = settings?.primaryColor || "#000000";

  const cookieStore = await cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || 'bn') as 'bn' | 'en'

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <style>{`
            :root {
                --primary: ${primaryColor};
            }
          `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable} antialiased font-bengali`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <I18nProvider initialLocale={locale}>
            {children}
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}








