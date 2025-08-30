import { create } from 'zustand'

interface LandingState {
  // Form states
  isContactFormOpen: boolean
  isDemoFormOpen: boolean
  isNewsletterFormOpen: boolean

  // User interactions
  hasScrolledToBottom: boolean
  currentSection: string

  // Actions
  openContactForm: () => void
  closeContactForm: () => void
  openDemoForm: () => void
  closeDemoForm: () => void
  openNewsletterForm: () => void
  closeNewsletterForm: () => void
  setScrolledToBottom: (value: boolean) => void
  setCurrentSection: (section: string) => void
}

export const useLandingStore = create<LandingState>((set) => ({
  // Initial state
  isContactFormOpen: false,
  isDemoFormOpen: false,
  isNewsletterFormOpen: false,
  hasScrolledToBottom: false,
  currentSection: 'hero',

  // Actions
  openContactForm: () => set({ isContactFormOpen: true }),
  closeContactForm: () => set({ isContactFormOpen: false }),
  openDemoForm: () => set({ isDemoFormOpen: true }),
  closeDemoForm: () => set({ isDemoFormOpen: false }),
  openNewsletterForm: () => set({ isNewsletterFormOpen: true }),
  closeNewsletterForm: () => set({ isNewsletterFormOpen: false }),
  setScrolledToBottom: (value) => set({ hasScrolledToBottom: value }),
  setCurrentSection: (section) => set({ currentSection: section }),
}))
