import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sapphire MUN",
  description: "Sapphire Model United Nations - Join us for an exceptional diplomatic experience",
  generator: "v0.dev",
  icons: {
    icon: "/images/sapphire-logo-navbar.png",
    shortcut: "/images/sapphire-logo-navbar.png",
    apple: "/images/sapphire-logo-navbar.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
