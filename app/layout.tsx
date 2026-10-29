import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { assertContentValid, getProfile } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

assertContentValid();

const profile = getProfile();

export const metadata: Metadata = {
  title: {
    default: `${profile.name} | ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.headline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
