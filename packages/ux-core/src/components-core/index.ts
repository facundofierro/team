// TeamHub Core Components
// These are custom components built with our design system
// They use external components as building blocks but have TeamHub styling

// Color Systems
export { coreColors, coreUtils } from './light-theme-colors'
export type { CoreColorKey, CoreInteractiveKey } from './light-theme-colors'

export { componentColors, componentUtils } from './dark-theme-colors'
export type {
  ComponentColorKey,
  ComponentInteractiveKey,
} from './dark-theme-colors'

// Sidebar Components
export {
  Sidebar,
  defaultTeamHubItems,
  type SidebarProps,
  type SidebarItem,
} from './sidebar'

// User Components
export {
  UserProfile,
  UserMenu,
  type UserProfileProps,
  type UserMenuProps,
} from './user'

// Form Card Components
export { FormCard, type FormCardProps } from './form-card/form-card'

// Typography Components
export { TitleWithSubtitle, type TitleWithSubtitleProps } from './typography'

// Button Components
export {
  PrimaryButton,
  ActionButton,
  TertiaryButton,
  GhostButton,
  SaveButton,
  ResetButton,
  AddButton,
  type PrimaryButtonProps,
  type ActionButtonProps,
  type TertiaryButtonProps,
  type GhostButtonProps,
} from './buttons'

// Switcher Components
export { ActiveIndicator, type ActiveIndicatorProps } from './switchers'

// AgentsList Components
export {
  AgentsList,
  type Agent,
  type AgentStats,
  type AgentsListProps,
  type StatusTabsProps,
  type AgentCardProps,
  type SearchBarProps,
  type ActionButtonsProps,
  type AgentStatus,
  type ViewMode,
  type StatusTab,
} from './agentsList'
