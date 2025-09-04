'use server'

import {
  createOrganization as createOrganizationFn,
  getOrganizations,
  reactiveDb,
} from '@agelum/db'
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
    const newOrg = await createOrganizationFn.execute(
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        databaseName: name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_'),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: session.user.id,
      },
      reactiveDb
    )

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
    const organizations = await getOrganizations.execute(
      { userId: session.user.id },
      reactiveDb
    )
    const organization = organizations.find((org) => org.id === organizationId)

    if (!organization) {
      throw new Error('Organization not found')
    }

    // If needed, call a public helper exported by @agelum/db for ensuring schemas
    // Currently, no public export is defined; skip runtime creation in Next build
    // and rely on migrations/setup scripts.

    return { success: true }
  } catch (error: any) {
    console.error('Error ensuring organization database setup:', error)
    return { success: false, error: error.message }
  }
}
