import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }, { locale: 'ru' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const resolvedParams = await params

  return {
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
      locale: resolvedParams.locale,
      url: `https://teamhub.ai/${resolvedParams.locale}`,
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
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const resolvedParams = await params

  return (
    <html lang={resolvedParams.locale} suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">{children}</div>
      </body>
    </html>
  )
}
