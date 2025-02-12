'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useNavigationStore } from '@/stores/navigationStore'

export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { setIsLoading } = useNavigationStore()

  useEffect(() => {
    // This runs after navigation is complete
    setIsLoading(false)
    console.log('debug setIsLoading false')
  }, [pathname, searchParams, setIsLoading])

  return null
}
