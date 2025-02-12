import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Organization } from '@teamhub/db'

type OrganizationStore = {
  currentOrganization: Organization | null
  setCurrentOrganization: (organization: Organization | null) => void
}

export const useOrganizationStore = create<OrganizationStore>()(
  persist(
    (set) => ({
      currentOrganization: null,
      setCurrentOrganization: (organization) =>
        set({ currentOrganization: organization }),
    }),
    {
      name: 'organization-storage',
    }
  )
)
