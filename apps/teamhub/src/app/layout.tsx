/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { db, NewOrganization } from '@teamhub/db'
import { NavigationEvents } from '@/components/layout/NavigationEvents'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TeamHub',
  description: 'TeamHub',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  const organizations = await db.getOrganizations(session?.user?.id!)

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className={inter.className}>
        <div className="flex h-screen">
          <Sidebar organizations={organizations} session={session} />
          <main className="flex-1 overflow-auto">
            {children}
            <NavigationEvents />
          </main>
        </div>
      </body>
    </html>
  )
}
