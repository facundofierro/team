import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TeamHub UX Core - Component Tests',
  description: 'Test suite for TeamHub UX Core components',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-bg-background text-bg-foreground min-h-screen">
        {children}
      </body>
    </html>
  )
}
