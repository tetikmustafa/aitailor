import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppHeader } from "@/components/AppHeader"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://aitailor.mustafatetik.com"),
  title: "AiTailor — AI-Powered CV Tailoring",
  description:
    "AI-powered ATS resume tailoring and LaTeX-to-PDF compilation tool by Mustafa Tetik.",
  keywords: ["cv builder", "resume tailoring", "ats optimization", "latex", "ai", "cover letter"],
  authors: [{ name: "Mustafa Tetik" }],
  creator: "Mustafa Tetik",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aitailor.mustafatetik.com",
    title: "AiTailor — AI-Powered CV Tailoring",
    description:
      "AI-powered ATS resume tailoring and LaTeX-to-PDF compilation tool by Mustafa Tetik.",
    siteName: "AiTailor",
  },
  twitter: {
    card: "summary_large_image",
    title: "AiTailor — AI-Powered CV Tailoring",
    description:
      "AI-powered ATS resume tailoring and LaTeX-to-PDF compilation tool by Mustafa Tetik.",
    creator: "@mustafatetik",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

import type { Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#1F2225" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} overflow-x-hidden w-full transition-colors duration-300`}>
        <AppHeader />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
