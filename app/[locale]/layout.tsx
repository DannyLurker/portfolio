import type { Metadata } from "next"
import { Geist, JetBrains_Mono } from "next/font/google"
import { MotionProvider } from "@/components/motion-provider"
import {
  assertContentValid,
  getProfile,
  locales,
  requireLocale,
} from "@/lib/content"
import "@/app/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

assertContentValid()

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = requireLocale(rawLocale)
  const profile = getProfile(locale)

  return {
    title: {
      default: `${profile.name} | ${profile.role}`,
      template: `%s | ${profile.name}`,
    },
    description: profile.headline,
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = requireLocale(rawLocale)

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
