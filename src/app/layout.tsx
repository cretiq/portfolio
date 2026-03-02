import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Sora } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  themeColor: "#0f0a1f",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Your Name — Portfolio",
  description: "Full-stack developer building things for the web and beyond.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Your Name — Portfolio",
    description: "Full-stack developer building things for the web and beyond.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Name — Portfolio",
    description: "Full-stack developer building things for the web and beyond.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
