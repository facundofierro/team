'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { InsightsList } from './InsightsList'

type InsightTable = {
  id: string
  name: string
}

type InsightsListWrapperProps = {
  tables: InsightTable[]
  selectedId?: string
  organizationId: string
}

export function InsightsListWrapper({
  tables,
  selectedId,
  organizationId,
}: InsightsListWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onTableSelect = (id: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('tableId', id)
    router.push(`/insights?${params.toString()}`)
  }

  return (
    <InsightsList
      tables={tables}
      selectedId={selectedId}
      onTableSelect={onTableSelect}
      organizationId={organizationId}
    />
  )
}
