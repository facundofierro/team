import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { log } from '@repo/logger'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Agelum AI Gateway',
  description: 'AI provider abstraction service for Agelum',
}

// Log application startup
if (typeof window === 'undefined') {
  log.aiGateway.main.info('AI Gateway application starting up', undefined, {
    environment: process.env.NODE_ENV || 'unknown',
    version: process.env.npm_package_version || 'unknown',
  })
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
