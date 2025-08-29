'use client'

import { PostHogProvider as PostHogReactProvider } from '@posthog/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { initPostHog, getPostHog } from '@/lib/posthog'

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize PostHog on mount
  useEffect(() => {
    initPostHog()
  }, [])

  // Track page views when route changes
  useEffect(() => {
    const posthog = getPostHog()
    if (posthog && pathname) {
      // Capture page view with current path and search params
      const url = searchParams?.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname

      posthog.capture('$pageview', {
        $current_url: url,
        path: pathname,
        search: searchParams?.toString() || '',
      })
    }
  }, [pathname, searchParams])

  // Only render PostHog provider if we have an API key
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>
  }

  return (
    <PostHogReactProvider
      apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
      options={{
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST ||
          'https://r1.teamxagents.com/posthog',
      }}
    >
      {children as any}
    </PostHogReactProvider>
  )
}
