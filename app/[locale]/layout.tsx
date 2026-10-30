import type { Metadata } from "next"
import { Geist, JetBrains_Mono } from "next/font/google"
import { MotionProvider } from "@/components/motion-provider"
import { SkipLink } from "@/components/layout/skip-link"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import {
  assertContentValid,
  getLinks,
  getMessages,
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

  const profile = getProfile(locale)
  const messages = getMessages(locale)
  const links = getLinks()

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <MotionProvider>
          <SkipLink label={messages["skip.label"]} />
          <SiteHeader
            locale={locale}
            displayName={profile.displayName}
            messages={messages}
          />
          <main
            id="main"
            tabIndex={-1}
            className="flex flex-1 flex-col outline-none"
          >
            {children}
          </main>
          <SiteFooter
            locale={locale}
            profile={profile}
            links={links}
            messages={messages}
          />
        </MotionProvider>
      </body>
    </html>
  )
}
