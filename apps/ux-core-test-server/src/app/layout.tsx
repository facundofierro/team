import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agelum UX Core - Component Tests',
  description: 'Test suite for Agelum UX Core components',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 min-h-screen">{children}</body>
    </html>
  )
}
