'use client'

import React from 'react'
import { ReactiveProvider } from '@drizzle/reactive/client'

interface ReactiveProviderWrapperProps {
  children: React.ReactNode
  organizationId: string
  relations: Record<string, string[]>
  revalidateFn?: (queryKey: string) => Promise<any>
}

export function ReactiveProviderWrapper({
  children,
  organizationId,
  relations,
  revalidateFn,
}: ReactiveProviderWrapperProps) {
  const config: any = {
    relations,
    organizationId,
  }

  // Only add revalidateFn if provided
  if (revalidateFn) {
    config.revalidateFn = revalidateFn
  }

  return <ReactiveProvider config={config}>{children}</ReactiveProvider>
}
