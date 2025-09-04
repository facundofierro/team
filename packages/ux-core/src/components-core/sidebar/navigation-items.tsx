import {
  LayoutDashboard,
  Users,
  Workflow,
  Database,
  FileText,
  Settings,
  CheckSquare,
} from 'lucide-react'
import { SidebarItem } from './sidebar'

export const defaultAgelumItems: SidebarItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'agents',
    name: 'AI Agents',
    icon: Users,
    submenu: [
      {
        id: 'chat',
        name: 'Chat',
      },
      {
        id: 'memory',
        name: 'Memory',
      },
      {
        id: 'tools',
        name: 'Tools',
      },
    ],
  },
  {
    id: 'workflows',
    name: 'Workflows',
    icon: Workflow,
  },
  {
    id: 'tasks',
    name: 'Tasks',
    icon: CheckSquare,
  },
  {
    id: 'data',
    name: 'Data Sources',
    icon: Database,
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: FileText,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
  },
]
