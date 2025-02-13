'use client'

import type { MessageType, Memory, MemoryWithTypes } from '@teamhub/db'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'

type SharedMemoryCardProps = {
  onChange: (sharedMemories: MemoryWithTypes[]) => void
  sharedMemories: MemoryWithTypes[]
}

export function SharedMemoryCard({
  onChange,
  sharedMemories,
}: SharedMemoryCardProps) {
  return (
    <Card className="h-full border-none bg-cardLight">
      <CardHeader>
        <CardTitle>Shared Memory</CardTitle>
      </CardHeader>
      <CardContent>
        {sharedMemories.map((memory) => (
          <div key={memory.id} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={memory.category}
              onChange={(e) =>
                onChange([
                  ...sharedMemories,
                  { ...memory, category: e.target.value },
                ])
              }
              className="flex-1 px-3 py-2 rounded-md bg-background"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
