import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Organization } from '@teamhub/db'

export type OrganizationStore = {
  currentOrganization: Organization | null
  setCurrentOrganization: (organization: Organization | null) => void
}

export const useOrganizationStore = create<OrganizationStore>()(
  persist(
    (
      set: (
        partial:
          | Partial<OrganizationStore>
          | ((state: OrganizationStore) => Partial<OrganizationStore>)
      ) => void
    ) => ({
      currentOrganization: null,
      setCurrentOrganization: (organization: Organization | null) =>
        set({ currentOrganization: organization }),
    }),
    {
      name: 'organization-storage',
    }
  )
)
