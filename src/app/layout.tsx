import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSchoolSettings } from "@/lib/branding/branding";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang={locale}>
      <head>
        <style>{`
            :root {
                --primary: ${primaryColor};
            }
          `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider initialLocale={locale}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}






