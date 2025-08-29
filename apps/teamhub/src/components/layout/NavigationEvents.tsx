'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAgentStore } from '@/stores/agentStore'

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { setIsLoading } = useAgentStore()

  useEffect(() => {
    // This runs after navigation is complete
    setIsLoading(false)
    console.log('debug setIsLoading false')
  }, [pathname, searchParams, setIsLoading])

  return null
}
