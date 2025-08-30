// TeamHub Core Components
// These are custom components built with our design system
// They use external components as building blocks but have TeamHub styling

// Navigation Components
export { Sidebar, defaultTeamHubItems, type SidebarItem } from './sidebar'

export {
  SidebarNavigationMenu,
  Breadcrumbs,
  Tabs,
  type SidebarNavigationMenuProps,
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
