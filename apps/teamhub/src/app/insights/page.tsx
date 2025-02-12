import { db } from '@teamhub/db'
import { redirect } from 'next/navigation'
import { InsightsListWrapper } from '@/components/insights/InsightsListWrapper'
import { DataGrid } from '@/components/insights/DataGrid'

// This would come from your database
const TEST_TABLES = [
  { id: '1', name: 'User Activities' },
  { id: '2', name: 'Performance Metrics' },
  { id: '3', name: 'Error Logs' },
  { id: '4', name: 'Usage Statistics' },
]

type TableData = {
  columns: { key: string; name: string }[]
  data: Record<string, string>[]
}

const TEST_DATA: Record<string, TableData> = {
  '1': {
    columns: [
      { key: 'timestamp', name: 'Timestamp' },
      { key: 'user', name: 'User' },
      { key: 'action', name: 'Action' },
    ],
    data: [
      { timestamp: '2024-03-20 10:00', user: 'John', action: 'Login' },
      { timestamp: '2024-03-20 10:05', user: 'Alice', action: 'Update' },
    ],
  },
  // Add more test data for other tables...
}

type PageProps = {
  params: Promise<any>
  searchParams: Promise<any>
}

export default async function InsightsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const tableId =
    typeof params.tableId === 'string' ? params.tableId : undefined
  const organizationId =
    typeof params.organizationId === 'string'
      ? params.organizationId
      : undefined

  if (!organizationId) {
    redirect('/')
  }

  const selectedTable = tableId
    ? TEST_TABLES.find((t) => t.id === tableId)
    : undefined
  const tableData = tableId ? TEST_DATA[tableId] : undefined

  return (
    <div className="flex h-screen bg-background">
      <div className="border-r w-60">
        <InsightsListWrapper
          tables={TEST_TABLES}
          selectedId={tableId}
          organizationId={organizationId}
        />
      </div>
      <div className="flex-1 h-full bg-background">
        {selectedTable && tableData ? (
          <DataGrid
            columns={tableData.columns}
            data={tableData.data}
            tableName={selectedTable.name}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a table to view its data
          </div>
        )}
      </div>
    </div>
  )
}
