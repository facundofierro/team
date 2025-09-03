/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { db, NewOrganization, getOrganizations, reactiveDb } from '@teamhub/db'
import { NavigationEvents } from '@/components/layout/NavigationEvents'
import { Toaster } from '@/components/ui/toaster'
import { ReactiveRootProvider } from '@/components/providers/ReactiveRootProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agelum',
  description: 'Agelum',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  const organizations = await getOrganizations.execute(
    { userId: session?.user?.id! },
    reactiveDb
  )

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
            <ReactiveRootProvider>
              {children}
              <NavigationEvents />
            </ReactiveRootProvider>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
