import { create } from 'zustand'

type NavigationStore = {
  currentPath: string | null
  isLoading: boolean
  setCurrentPath: (path: string | null) => void
  setIsLoading: (loading: boolean) => void
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  currentPath: null,
  isLoading: false,
  setCurrentPath: (path) => set({ currentPath: path }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}))
