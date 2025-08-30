import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TeamHub - AI Agent Management Platform',
  description:
    'Enterprise AI agent management platform for organizations to create, manage, and orchestrate AI agents at scale.',
  keywords: [
    'AI agents',
    'enterprise',
    'management platform',
    'automation',
    'AI orchestration',
  ],
  authors: [{ name: 'TeamHub' }],
  creator: 'TeamHub',
  publisher: 'TeamHub',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://teamhub.ai',
    title: 'TeamHub - AI Agent Management Platform',
    description:
      'Enterprise AI agent management platform for organizations to create, manage, and orchestrate AI agents at scale.',
    siteName: 'TeamHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TeamHub - AI Agent Management Platform',
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
