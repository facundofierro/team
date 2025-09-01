# Configuration Components

This document describes the new configuration components added to the ux-core package, designed to create agent configuration interfaces similar to the screenshot from designs.magicpath.ai.

## Overview

The configuration components are organized into three categories:

1. **Base Components** - Reusable building blocks
2. **Specialized Cards** - Ready-to-use card layouts
3. **Example Pages** - Complete page implementations

## Base Components

### TitleWithSubtitle

A header component with title, subtitle, and optional status indicator.

```tsx
import { TitleWithSubtitle } from '@teamhub/ux-core'

;<TitleWithSubtitle
  title="Procurement Manager"
  subtitle="Manages materials sourcing, supplier negotiations, and cost analysis for construction projects."
  status="active"
  onStatusChange={(status) => console.log('Status changed:', status)}
/>
```

### ConfigurationCard

A generic card component that supports title, subtitle, icon, header actions, and footer.

```tsx
import { ConfigurationCard, ConfigButton } from '@teamhub/ux-core'

;<ConfigurationCard
  title="Basic Settings"
  subtitle="Configure basic agent properties"
  icon={Settings}
  headerAction={
    <ConfigButton variant="primary" size="sm" icon={Plus}>
      Add Item
    </ConfigButton>
  }
  footer={<p className="text-sm text-gray-500">Footer content</p>}
>
  <p>Card content goes here</p>
</ConfigurationCard>
```

### ConfigButton

A button component with multiple variants and sizes.

```tsx
import { ConfigButton } from '@teamhub/ux-core'

;<ConfigButton variant="primary" size="md" icon={Plus}>
  Add Schedule
</ConfigButton>
```

## Specialized Cards

### BasicSettingsCard

A card for basic agent settings with name and role inputs.

```tsx
import { BasicSettingsCard } from '@teamhub/ux-core'

;<BasicSettingsCard
  agentName="Procurement Manager"
  onAgentNameChange={setAgentName}
  roleType="Manager"
  onRoleTypeChange={setRoleType}
/>
```

### PromptCard

A card for editing AI agent prompts with character count and AI/Templates buttons.

```tsx
import { PromptCard } from '@teamhub/ux-core'

;<PromptCard
  value={prompt}
  onChange={setPrompt}
  maxLength={4000}
  placeholder="Enter your prompt here..."
/>
```

### ScheduledExecutionsCard

A card for managing scheduled tasks with add, edit, delete, and toggle functionality.

```tsx
import { ScheduledExecutionsCard } from '@teamhub/ux-core'

;<ScheduledExecutionsCard
  schedules={[
    {
      id: '1',
      title: 'Daily Schedule',
      description: 'Generate daily cost analysis report',
      nextExecution: '2024-01-15 09:00',
      frequency: 'Daily',
      status: 'active',
    },
  ]}
  onAddSchedule={() => console.log('Add schedule')}
  onEditSchedule={(id) => console.log('Edit schedule:', id)}
  onDeleteSchedule={(id) => console.log('Delete schedule:', id)}
  onToggleSchedule={(id) => console.log('Toggle schedule:', id)}
/>
```

### ToolAssignmentCard

A card for managing tool assignments with checkboxes and remove functionality.

```tsx
import { ToolAssignmentCard } from '@teamhub/ux-core'

;<ToolAssignmentCard
  tools={[
    {
      id: '1',
      name: 'Database Query',
      description: 'Execute SQL queries on connected databases.',
      type: 'database',
      enabled: true,
    },
  ]}
  onAddTool={() => console.log('Add tool')}
  onToggleTool={(id, enabled) => console.log('Toggle tool:', id, enabled)}
  onRemoveTool={(id) => console.log('Remove tool:', id)}
/>
```

### SecurityAccessCard

A card for managing security and access permissions.

```tsx
import { SecurityAccessCard } from '@teamhub/ux-core'

;<SecurityAccessCard
  value="admins-only"
  onChange={setSecurityLevel}
  options={[
    {
      value: 'admins-only',
      label: 'Admins Only',
      description: 'Only administrators can manage this agent',
    },
    {
      value: 'managers',
      label: 'Managers',
      description: 'Managers and administrators can manage this agent',
    },
  ]}
/>
```

## Example Pages

### AgentConfigurationPage

A complete example page that demonstrates how to use all components together.

```tsx
import { AgentConfigurationPage } from '@teamhub/ux-core'

;<AgentConfigurationPage agentId="agent-123" />
```

## Usage Patterns

### 1. Individual Cards

Use specialized cards for specific functionality:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <BasicSettingsCard
    agentName={agentName}
    onAgentNameChange={setAgentName}
    roleType={roleType}
    onRoleTypeChange={setRoleType}
  />

  <ScheduledExecutionsCard
    schedules={schedules}
    onAddSchedule={handleAddSchedule}
    onEditSchedule={handleEditSchedule}
    onDeleteSchedule={handleDeleteSchedule}
    onToggleSchedule={handleToggleSchedule}
  />
</div>
```

### 2. Custom Configuration

Use base components to create custom layouts:

```tsx
<ConfigurationCard
  title="Custom Section"
  icon={CustomIcon}
  headerAction={
    <ConfigButton variant="secondary" size="sm">
      Custom Action
    </ConfigButton>
  }
>
  <div className="space-y-4">{/* Custom content */}</div>
</ConfigurationCard>
```

### 3. Complete Page

Use the example page as a starting point and customize as needed:

```tsx
function MyAgentConfigPage() {
  // Custom state and handlers
  const [agentData, setAgentData] = useState(initialData)

  return (
    <div className="max-w-7xl mx-auto p-6">
      <TitleWithSubtitle
        title={agentData.name}
        subtitle={agentData.description}
        status={agentData.status}
        onStatusChange={handleStatusChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Your custom card layout */}
      </div>
    </div>
  )
}
```

## Styling

All components use the TeamHub design system with:

- **Colors**: Purple primary (#8A548C), gray neutrals
- **Spacing**: Consistent padding and margins
- **Typography**: Clear hierarchy with proper font weights
- **Shadows**: Subtle elevation for cards
- **Borders**: Light gray borders for separation

## Accessibility

Components include:

- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

## Responsive Design

Components are responsive by default:

- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly button sizes
- Readable text at all breakpoints

## Integration with TeamHub

These components are designed to work with:

- TeamHub's reactive data system
- Existing form validation patterns
- TeamHub's authentication and authorization
- TeamHub's design tokens and color system
