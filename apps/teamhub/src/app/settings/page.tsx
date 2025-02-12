import { SettingsDetails } from '@/components/settings/SettingsDetails'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db, OrganizationSettings, ToolTypeWithTypes } from '@teamhub/db'
import { getToolTypes } from '@teamhub/ai'
import { ToolTypeDefinition } from '@teamhub/ai/src/tools'

async function updateSettings(settings: OrganizationSettings) {
  'use server'
  if (!settings.organizationId) return

  await db.updateOrganizationSettings(settings)
  revalidatePath('/settings')
}

type PageProps = {
  params: Promise<any>
  searchParams: Promise<any>
}

export default async function SettingsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const id = typeof params.id === 'string' ? params.id : undefined
  const tab = typeof params.tab === 'string' ? params.tab : undefined
  const organizationId =
    typeof params.organizationId === 'string'
      ? params.organizationId
      : undefined

  if (!organizationId) {
    redirect('/')
  }

  const settings = await db.getOrganizationSettings(organizationId)
  const toolTypes = await getToolTypes()
  settings.toolTypes = toolTypes

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 h-full bg-background">
        <SettingsDetails settings={settings} onSave={updateSettings} />
      </div>
    </div>
  )
}
