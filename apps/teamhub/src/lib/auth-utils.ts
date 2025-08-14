import { auth } from '@/auth'
import { db } from '@teamhub/db'
import { redirect } from 'next/navigation'

/**
 * Get the current user's session and validate authentication
 */
export async function getAuthenticatedUser() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }
  return session.user
}

/**
 * Get organization ID from search params and validate user access
 */
export async function getValidatedOrganizationId(
  searchParams: Promise<any>
): Promise<string> {
  const params = await searchParams
  const organizationId =
    typeof params.organizationId === 'string'
      ? params.organizationId
      : undefined

  if (!organizationId) {
    redirect('/')
  }

  const user = await getAuthenticatedUser()

  // Ensure user.id is defined
  if (!user.id) {
    redirect('/auth/signin')
  }

  // Get user's organizations and validate access
  const organizations = await db.getOrganizations(user.id)
  const hasAccess = organizations.some((org) => org.id === organizationId)

  if (!hasAccess) {
    console.error(
      `❌ User ${user.id} does not have access to organization ${organizationId}`
    )
    redirect('/')
  }

  return organizationId
}

/**
 * Validate that a user has access to a specific organization
 */
export async function validateOrganizationAccess(
  userId: string,
  organizationId: string
): Promise<boolean> {
  try {
    const organizations = await db.getOrganizations(userId)
    return organizations.some((org) => org.id === organizationId)
  } catch (error) {
    console.error('❌ Error validating organization access:', error)
    return false
  }
}
