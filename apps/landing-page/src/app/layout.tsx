import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agelum - AI Agent Management Platform',
  description:
    'Enterprise AI agent management platform for organizations to create, manage, and orchestrate AI agents at scale.',
  keywords: [
    'AI agents',
    'enterprise',
    'management platform',
    'automation',
    'AI orchestration',
  ],
  authors: [{ name: 'Agelum' }],
  creator: 'Agelum',
  publisher: 'Agelum',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://teamhub.ai',
    title: 'Agelum - AI Agent Management Platform',
    description:
      'Enterprise AI agent management platform for organizations to create, manage, and orchestrate AI agents at scale.',
    siteName: 'Agelum',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agelum - AI Agent Management Platform',
    description:
      'Enterprise AI agent management platform for organizations to create, manage, and orchestrate AI agents at scale.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">{children}</div>
      </body>
    </html>
  )
}
