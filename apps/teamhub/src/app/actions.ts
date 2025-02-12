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

  const newOrg = await db.createOrganization({
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: session.user.id,
  })

  // Create new URLSearchParams from the string
  const searchParams = new URLSearchParams(currentSearchParams)
  searchParams.set('organizationId', newOrg.id)

  revalidatePath('/')
  redirect(`${currentPath}?${searchParams.toString()}`)
}
