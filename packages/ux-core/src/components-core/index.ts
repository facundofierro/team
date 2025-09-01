// TeamHub Core Components
// These are custom components built with our design system
// They use external components as building blocks but have TeamHub styling

// Navigation Components
export { Sidebar, defaultTeamHubItems, type SidebarItem } from './sidebar'

export {
  SidebarNavigationMenu,
  Breadcrumbs,
  Tabs,
  type NavigationMenuItem,
  type BreadcrumbItem,
  type TabItem,
} from './navigation-menu'

export {
  UserProfile,
  UserMenu,
  type UserProfileProps,
  type UserMenuProps,
} from './user-profile'

export {
  Search,
  GlobalSearch,
  type SearchProps,
  type SearchResult,
  type GlobalSearchProps,
} from './search'

export {
  Layout,
  PageHeader,
  ContentContainer,
  type LayoutProps,
  type PageHeaderProps,
  type ContentContainerProps,
} from './layout'

// Data Display Components (Phase 2)
export {
  StatusIndicator,
  AgentCard,
  MetricCard,
  DataTable,
  ListItem,
  EmptyState,
  type StatusIndicatorProps,
  type AgentCardProps,
  type MetricCardProps,
  type DataTableColumn,
  type DataTableProps,
  type ListItemProps,
  type EmptyStateProps,
} from './data-display'

// Form Components (Phase 2)
export {
  FormSection,
  EnhancedInput,
  EnhancedSelect,
  Toggle,
  ScheduleItem,
  ToolItem,
  FormActions,
  type FormSectionProps,
  type EnhancedInputProps,
  type SelectOption,
  type EnhancedSelectProps,
  type ToggleProps,
  type ScheduleItemProps,
  type ToolItemProps,
  type FormActionsProps,
} from './forms'

// Configuration Components (Phase 3)
export {
  TitleWithSubtitle,
  ConfigurationCard,
  ConfigButton,
  ScheduledExecutionItem,
  ToolAssignmentItem,
  PromptEditor,
  SecurityAccess,
  type TitleWithSubtitleProps,
  type ConfigurationCardProps,
  type ConfigButtonProps,
  type ScheduledExecutionItemProps,
  type ToolAssignmentItemProps,
  type PromptEditorProps,
  type SecurityAccessProps,
} from './configuration-cards'

// Specialized Card Components
export {
  BasicSettingsCard,
  PromptCard,
  ScheduledExecutionsCard,
  ToolAssignmentCard,
  SecurityAccessCard,
  type BasicSettingsCardProps,
  type PromptCardProps,
  type ScheduledExecutionsCardProps,
  type ToolAssignmentCardProps,
  type SecurityAccessCardProps,
} from './cards'

// Example Pages
export {
  AgentConfigurationPage,
  type AgentConfigurationPageProps,
} from './agent-configuration-page'
