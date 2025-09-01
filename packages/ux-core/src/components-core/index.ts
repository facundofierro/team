// TeamHub Core Components
// These are custom components built with our design system
// They use external components as building blocks but have TeamHub styling

// Sidebar Components
export {
  Sidebar,
  defaultTeamHubItems,
  type SidebarProps,
  type SidebarItem,
} from './sidebar'

// Navigation Components
export {
  SidebarNavigationMenu,
  Breadcrumbs,
  Tabs,
  type NavigationMenuItem,
  type BreadcrumbItem,
  type TabItem,
} from './navigation'

export {
  Search,
  GlobalSearch,
  type SearchProps,
  type SearchResult,
  type GlobalSearchProps,
} from './navigation'

// User Components
export {
  UserProfile,
  UserMenu,
  type UserProfileProps,
  type UserMenuProps,
} from './user'

// Layout Components
export {
  Layout,
  PageHeader,
  ContentContainer,
  type LayoutProps,
  type PageHeaderProps,
  type ContentContainerProps,
} from './layout'

// Data Display Components
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

// Form Components
export {
  FormSection,
  EnhancedInput,
  EnhancedSelect,
  EnhancedTextarea,
  Toggle,
  ScheduleItem,
  ToolItem,
  FormActions,
  type FormSectionProps,
  type EnhancedInputProps,
  type SelectOption,
  type EnhancedSelectProps,
  type EnhancedTextareaProps,
  type ToggleProps,
  type ScheduleItemProps,
  type ToolItemProps,
  type FormActionsProps,
} from './forms'

// Form Card Components
export { FormCard, type FormCardProps } from './form-card'

// Typography Components
export { TitleWithSubtitle, type TitleWithSubtitleProps } from './typography'

// Status Components
export { ActiveIndicator, type ActiveIndicatorProps } from './status'
