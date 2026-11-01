import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { SkipLink } from "@/components/layout/skip-link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteIntroSessionScript } from "@/components/site-intro-session-script";
import { SiteAtmosphere } from "@/components/site-atmosphere";
import {
  getLanguageAlternates,
  getPageUrl,
  getSiteOrigin,
  openGraphLocales,
  socialImageSize,
} from "@/lib/seo";
import {
  assertContentValid,
  getLinks,
  getMessages,
  getProfile,
  locales,
  requireLocale,
} from "@/lib/content";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

assertContentValid();

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = requireLocale(rawLocale);
  const profile = getProfile(locale);

  return {
    metadataBase: getSiteOrigin(),
    title: {
      default: `${profile.name} | ${profile.role}`,
      template: `%s | ${profile.name}`,
    },
    description: profile.headline,
    alternates: {
      canonical: getPageUrl(locale),
      languages: getLanguageAlternates(),
    },
    openGraph: {
      type: "website",
      title: `${profile.name} | ${profile.role}`,
      description: profile.headline,
      url: getPageUrl(locale),
      siteName: profile.name,
      locale: openGraphLocales[locale],
      images: [
        {
          url: getPageUrl(locale, "opengraph-image"),
          width: socialImageSize.width,
          height: socialImageSize.height,
          alt: `${profile.name} | ${profile.role}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} | ${profile.role}`,
      description: profile.headline,
      images: [getPageUrl(locale, "opengraph-image")],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = requireLocale(rawLocale);

  const profile = getProfile(locale);
  const messages = getMessages(locale);
  const links = getLinks();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <SiteIntroSessionScript />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <noscript>
          <style>{"#site-intro { display: none !important; }"}</style>
        </noscript>
        <MotionProvider>
          <SiteAtmosphere
            name={profile.name}
            skipLabel={messages["intro.skip"]}
          />
          <div className="relative z-10 flex flex-1 flex-col">
            <SkipLink label={messages["skip.label"]} />
            <SiteHeader
              locale={locale}
              displayName={profile.displayName}
              messages={messages}
            />
            <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
              {children}
            </main>
            <SiteFooter
              locale={locale}
              profile={profile}
              links={links}
              messages={messages}
            />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
