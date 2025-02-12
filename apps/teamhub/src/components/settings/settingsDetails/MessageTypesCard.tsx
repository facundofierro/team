'use client'

import type { MessageType } from '@teamhub/db'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'

type MessageTypesCardProps = {
  messageTypes: MessageType[]
  onChange: (messageTypes: MessageType[]) => void
}

export function MessageTypesCard({
  messageTypes,
  onChange,
}: MessageTypesCardProps) {
  const handleMessageTypeChange = (updatedType: MessageType) => {
    const updatedTypes = messageTypes.map((type) =>
      type.id === updatedType.id ? updatedType : type
    )
    onChange(updatedTypes)
  }

  return (
    <Card className="h-full border-none bg-cardLight">
      <CardHeader>
        <CardTitle>Message Types</CardTitle>
      </CardHeader>
      <CardContent>
        {messageTypes.map((type) => (
          <div key={type.id} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={type.name}
              onChange={(e) =>
                handleMessageTypeChange({
                  ...type,
                  name: e.target.value,
                })
              }
              className="flex-1 px-3 py-2 rounded-md bg-background"
            />
            <input
              type="checkbox"
              onChange={(e) =>
                handleMessageTypeChange({
                  ...type,
                  isActive: e.target.checked,
                })
              }
              className="w-4 h-4"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
