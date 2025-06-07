'use client'

import { MessageTypesCard } from './settingsDetails/MessageTypesCard'
import { SharedMemoryCard } from './settingsDetails/SharedMemoryCard'
import type { OrganizationSettings } from '@teamhub/db'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { UsersCard } from './settingsDetails/UsersCard'
import { ToolsCard } from './settingsDetails/ToolsCard'
import { MemoryWithTypes } from '@teamhub/db'

type SettingsDetailsProps = {
  settings?: OrganizationSettings
  sharedMemories?: MemoryWithTypes[]
  onSave?: (settings: OrganizationSettings) => Promise<void>
}

export function SettingsDetails({
  settings,
  sharedMemories,
  onSave,
}: SettingsDetailsProps) {
  const [hasChanges, setHasChanges] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<
    Partial<OrganizationSettings>
  >({})
  const [activeTab, setActiveTab] = useState('messageTypes')

  // Reset state when settings change
  useEffect(() => {
    if (settings) {
      setHasChanges(false)
      setPendingChanges({})
    }
  }, [settings])

  const handleChange = (changes: Partial<OrganizationSettings>) => {
    setHasChanges(true)
    setPendingChanges((prev) => ({
      ...prev,
      ...changes,
    }))
  }

  const handleSave = async () => {
    if (!settings) return

    const updatedSettings = {
      ...settings,
      ...pendingChanges,
    }

    await onSave?.(updatedSettings)
    setHasChanges(false)
    setPendingChanges({})
  }

  const handleCancel = () => {
    setHasChanges(false)
    setPendingChanges({})
  }

  if (!settings) {
    return (
      <div className="flex flex-col h-full p-6 bg-menu2">
        <Skeleton className="w-full mb-4 h-9" />
        <Skeleton className="h-[calc(100%-3rem)] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-menu2">
      <div className="flex-1 p-6 overflow-hidden">
        <div className={hasChanges ? 'h-[calc(100%-4rem)]' : 'h-full'}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="flex w-full">
              <TabsTrigger value="tools" className="flex-1">
                Tools
              </TabsTrigger>
              <TabsTrigger value="messageTypes" className="flex-1">
                Message Types
              </TabsTrigger>
              <TabsTrigger value="sharedMemory" className="flex-1">
                Shared Memory
              </TabsTrigger>
              <TabsTrigger value="users" className="flex-1">
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="h-[calc(100%-3rem)]">
              <ToolsCard
                tools={settings.tools}
                toolTypes={settings.toolTypes}
                organizationId={settings.organizationId}
                onChange={(tools) => handleChange({ tools })}
              />
            </TabsContent>

            <TabsContent value="messageTypes" className="h-[calc(100%-3rem)]">
              <MessageTypesCard
                messageTypes={settings.messageTypes}
                onChange={(messageTypes) => handleChange({ messageTypes })}
              />
            </TabsContent>

            <TabsContent value="sharedMemory" className="h-[calc(100%-3rem)]">
              <SharedMemoryCard
                onChange={(sharedMemories) => {}}
                sharedMemories={sharedMemories ?? []}
              />
            </TabsContent>

            <TabsContent value="users" className="h-[calc(100%-3rem)]">
              <UsersCard
                users={settings.users}
                onChange={(users) => handleChange({ users })}
              />
            </TabsContent>
          </Tabs>
        </div>

        {hasChanges && (
          <div className="flex items-center justify-end h-16 gap-2 px-4 mt-4 bg-cardLight rounded-xl">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave}>
              Save changes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
