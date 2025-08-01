'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Database, CheckCircle, AlertCircle } from 'lucide-react'
import { useOrganizationStore } from '@/stores/organizationStore'
import { useAgentStore } from '@/stores/agentStore'
import { cn } from '@/lib/utils'
import { useRouter, usePathname } from 'next/navigation'
import { Organization, NewOrganization } from '@teamhub/db'
import { Input } from '@/components/ui/input'
import {
  createOrganization,
  ensureOrganizationDatabaseSetup,
} from '@/app/actions'

type OrganizationSwitcherProps = {
  organizations: Organization[]
}

export function OrganizationSwitcher({
  organizations,
}: OrganizationSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isSwitching, setIsSwitching] = useState<string | null>(null)
  const [setupStatus, setSetupStatus] = useState<{
    [key: string]: 'loading' | 'success' | 'error'
  }>({})
  const { currentOrganization, setCurrentOrganization } = useOrganizationStore()
  const { setSelectedAgentId, setSelectedAgent } = useAgentStore()
  const router = useRouter()
  const pathname = usePathname()

  const handleOrganizationSwitch = async (org: Organization) => {
    setIsSwitching(org.id)
    setSetupStatus((prev) => ({ ...prev, [org.id]: 'loading' }))

    try {
      // Ensure database schemas exist for this organization
      const result = await ensureOrganizationDatabaseSetup(org.id)

      if (result.success) {
        setSetupStatus((prev) => ({ ...prev, [org.id]: 'success' }))
        setCurrentOrganization(org)
        setSelectedAgentId(null)
        setSelectedAgent(null)
        setIsOpen(false)
        // Refresh the current page with new organizationId
        router.push(`${pathname}?organizationId=${org.id}`)
      } else {
        setSetupStatus((prev) => ({ ...prev, [org.id]: 'error' }))
        console.error('Database setup failed:', result.error)
        alert(`Failed to setup database for organization: ${result.error}`)
      }
    } catch (error: any) {
      setSetupStatus((prev) => ({ ...prev, [org.id]: 'error' }))
      console.error('Error switching organization:', error)
      alert(`Error switching organization: ${error.message}`)
    } finally {
      setIsSwitching(null)
    }
  }

  const getStatusIcon = (orgId: string) => {
    const status = setupStatus[orgId]
    switch (status) {
      case 'loading':
        return <Database className="w-4 h-4 animate-spin" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const handleCreateOrganization = async () => {
    if (!newOrgName.trim() || isCreating) return

    setIsCreating(true)

    try {
      const formData = new FormData()
      formData.set('name', newOrgName.trim())

      await createOrganization(formData, pathname, window.location.search)

      // Reset form state
      setNewOrgName('')
      setIsCreateDialogOpen(false)
    } catch (error: any) {
      console.error('Failed to create organization:', error)
      const errorMessage =
        error?.message || 'Failed to create organization. Please try again.'
      alert(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  // If no organizations exist, show create organization dialog
  if (organizations.length === 0) {
    return (
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Card className="p-4 m-4 transition-colors cursor-pointer hover:bg-accent">
            <Button
              variant="ghost"
              className="flex flex-row items-center w-full gap-4"
            >
              <PlusCircle className="w-6 h-6" />
              <div className="flex flex-col items-start">
                <span>Create</span>
                <span>Organization</span>
              </div>
            </Button>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Organization name"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            disabled={isCreating}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateOrganization()
              }
            }}
          />
          <DialogFooter>
            <Button
              onClick={handleCreateOrganization}
              disabled={!newOrgName.trim() || isCreating}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  if (!currentOrganization && organizations.length > 0) {
    setCurrentOrganization(organizations[0])
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Card className="p-4 m-4 transition-colors cursor-pointer hover:bg-accent">
            <p className="text-sm font-medium text-center">
              {currentOrganization?.name || 'Select Organization'}
            </p>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Switch Organization</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {organizations.map((org) => (
              <Card
                key={org.id}
                className={cn(
                  'p-4 cursor-pointer hover:bg-accent transition-colors',
                  currentOrganization?.id === org.id ? 'bg-accent' : '',
                  isSwitching === org.id ? 'opacity-50 pointer-events-none' : ''
                )}
                onClick={() => handleOrganizationSwitch(org)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{org.name}</p>
                  {getStatusIcon(org.id)}
                </div>
                {isSwitching === org.id && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Setting up database...
                  </p>
                )}
              </Card>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsOpen(false)
                setIsCreateDialogOpen(true)
              }}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create New Organization
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Organization name"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            disabled={isCreating}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateOrganization()
              }
            }}
          />
          <DialogFooter>
            <Button
              onClick={handleCreateOrganization}
              disabled={!newOrgName.trim() || isCreating}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setNewOrgName('')
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
