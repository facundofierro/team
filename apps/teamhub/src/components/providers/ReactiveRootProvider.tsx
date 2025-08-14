'use client'

import React from 'react'
import { TrpcReactiveProvider } from '@drizzle/reactive/client'
import { reactiveRelations } from '@teamhub/db/reactive-config'
import { trpcClient } from '@/lib/trpc'
import { useSearchParams } from 'next/navigation'
import { useOrganizationStore } from '@/stores/organizationStore'

export function ReactiveRootProvider({
  children,
}: {
  // Relax typing to avoid cross-package ReactNode mismatches
  children: any
}) {
  const searchParams = useSearchParams()
  const organizationIdFromUrl = searchParams.get('organizationId') || undefined
  const { currentOrganization } = useOrganizationStore()
  const organizationId = organizationIdFromUrl || currentOrganization?.id

  if (!organizationId) {
    return <>{children}</>
  }

  return (
    <TrpcReactiveProvider
      organizationId={organizationId}
      relations={reactiveRelations}
      trpcClient={trpcClient}
    >
      {children}
    </TrpcReactiveProvider>
  )
}
