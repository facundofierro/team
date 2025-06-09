'use server'

import { db } from '@teamhub/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export async function createOrganization(
  formData: FormData,
  currentPath: string,
  currentSearchParams: string
) {
  const name = formData.get('name')?.toString()
  if (!name) throw new Error('Name is required')

  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  if (!session.user) throw new Error('Unauthorized')

  try {
    const newOrg = await db.createOrganization({
      id: crypto.randomUUID(),
      name: name.trim(),
      databaseName: name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_'),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: session.user.id,
    })

    // Create new URLSearchParams from the string
    const searchParams = new URLSearchParams(currentSearchParams)
    searchParams.set('organizationId', newOrg.id)

    revalidatePath('/')
    redirect(`${currentPath}?${searchParams.toString()}`)
  } catch (error: any) {
    // Handle unique constraint violation
    if (
      error?.code === '23505' &&
      error?.constraint === 'organization_name_unique'
    ) {
      throw new Error(
        'An organization with this name already exists. Please choose a different name.'
      )
    }
    throw error
  }
}

export async function ensureOrganizationDatabaseSetup(organizationId: string) {
  const session = await auth()
  if (!session || !session.user?.id) throw new Error('Unauthorized')

  try {
    // Get organization info
    const organizations = await db.getOrganizations(session.user.id)
    const organization = organizations.find((org) => org.id === organizationId)

    if (!organization) {
      throw new Error('Organization not found')
    }

    // First ensure the database exists, then ensure schemas and tables exist
    const { createOrgDatabaseAndSchemas } = await import(
      '@teamhub/db/src/db/functions/utils/database'
    )
    await createOrgDatabaseAndSchemas(organization.databaseName)

    return { success: true }
  } catch (error: any) {
    console.error('Error ensuring organization database setup:', error)
    return { success: false, error: error.message }
  }
}
