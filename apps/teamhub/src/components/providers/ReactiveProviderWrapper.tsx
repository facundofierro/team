'use client'

import React from 'react'
import { ReactiveProvider } from '@drizzle/reactive/client'

interface ReactiveProviderWrapperProps {
  children: React.ReactNode
  organizationId: string
  relations: Record<string, string[]>
}

export function ReactiveProviderWrapper({
  children,
  organizationId,
  relations,
}: ReactiveProviderWrapperProps) {
  return (
    <ReactiveProvider
      config={{
        relations,
        organizationId,
      }}
    >
      {children}
    </ReactiveProvider>
  )
}
