'use client'

import { Card, CardContent } from '@/components/ui/card'

export function DashboardCard() {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-1 p-4">
        <div className="h-full rounded-md">
          <h3 className="mb-4 text-lg font-medium">Dashboard</h3>
          <div className="space-y-4">Dashboard content goes here</div>
        </div>
      </CardContent>
    </Card>
  )
}
