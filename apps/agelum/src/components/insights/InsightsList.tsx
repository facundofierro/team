'use client'

import { Button } from '@/components/ui/button'
import { Database, Plus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

type InsightTable = {
  id: string
  name: string
  description?: string
}

type InsightsListProps = {
  tables: InsightTable[]
  selectedId?: string
  onTableSelect: (id: string) => void
  organizationId: string
}

export function InsightsList({
  tables,
  selectedId,
  onTableSelect,
  organizationId,
}: InsightsListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-sm font-semibold">Insights Tables</h2>
        <Button variant="ghost" size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {tables.map((table) => (
            <Button
              key={table.id}
              variant="ghost"
              className={`w-full justify-start ${
                selectedId === table.id
                  ? 'bg-purple-100 dark:bg-purple-900/30'
                  : ''
              }`}
              onClick={() => onTableSelect(table.id)}
            >
              <Database className="w-4 h-4 mr-2" />
              <span className="truncate">{table.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
