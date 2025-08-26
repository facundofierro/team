# TeamHub Design System & Common Elements

## Overview

This document defines the common design elements, technical requirements, and UI patterns used across all TeamHub views. Each view-specific prompt will reference this system to avoid repetition.

---

## 🛠️ Technical Foundation

### Core Technologies

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.0
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time**: WebSocket or Server-Sent Events

### Development Standards

- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Testing**: Playwright for E2E, Jest for unit tests
- **Performance**: React.memo, lazy loading, code splitting
- **Accessibility**: WCAG 2.1 AA compliance

---

## 🎨 Visual Design System

### Color Palette

- **Primary**: TeamHub Orange (#f97316) - Primary actions, highlights
- **Secondary**: TeamHub Blue (#3b82f6) - Secondary actions, links
- **Success**: Green (#22c55e) - Success states, active status
- **Warning**: Yellow (#eab308) - Warning states, idle status
- **Error**: Red (#ef4444) - Error states, offline status
- **Neutral**: Gray scale (#f8fafc to #0f172a) - Text, backgrounds, borders

### Typography

- **Font Family**: Inter (system fallback: -apple-system, BlinkMacSystemFont, sans-serif)
- **Heading Sizes**:
  - H1: text-4xl (36px) font-bold
  - H2: text-3xl (30px) font-semibold
  - H3: text-2xl (24px) font-semibold
  - H4: text-xl (20px) font-medium
  - H5: text-lg (18px) font-medium
- **Body Text**: text-base (16px) font-normal
- **Small Text**: text-sm (14px) font-normal
- **Caption**: text-xs (12px) font-normal

### Spacing System

- **Grid**: 4px base unit
- **Spacing Scale**: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
- **Component Spacing**:
  - Compact: 16px
  - Standard: 24px
  - Relaxed: 32px
  - Loose: 48px

### Shadows & Elevation

- **Level 1**: shadow-sm (subtle elevation)
- **Level 2**: shadow (card elevation)
- **Level 3**: shadow-md (modal elevation)
- **Level 4**: shadow-lg (overlay elevation)

---

## 🧩 Common UI Components

### Navigation Components

- **Left Sidebar**: Fixed width (280px), collapsible to 64px
- **Top Tabs**: Horizontal tab navigation with active states
- **Breadcrumbs**: Navigation hierarchy display
- **Search Bar**: Global search with filters and suggestions

### Data Display Components

- **Data Tables**: Sortable columns, pagination, row selection, bulk actions
- **Cards**: Information containers with headers, content, and actions
- **Lists**: Vertical item lists with icons, titles, and descriptions
- **Grids**: Responsive grid layouts for content organization

### Form Components

- **Input Fields**: Text, number, email, password with validation states
- **Dropdowns**: Single and multi-select with search
- **Checkboxes & Radios**: Selection controls with proper labeling
- **Buttons**: Primary (orange), Secondary (gray), Tertiary (text), Danger (red)
- **File Upload**: Drag & drop with progress indicators

### Feedback Components

- **Loading States**: Skeleton loaders, spinners, progress bars
- **Notifications**: Toast messages, alert banners, status indicators
- **Empty States**: No data illustrations with helpful text
- **Error States**: Error messages with recovery suggestions

---

## 📱 Responsive Design Patterns

### Breakpoints

- **Mobile**: < 768px (single column, stacked layout)
- **Tablet**: 768px - 1024px (two column layout)
- **Desktop**: 1024px - 1280px (full layout with sidebars)
- **Large Desktop**: > 1280px (expanded layout with more whitespace)

### Layout Patterns

- **Mobile First**: Design for mobile, enhance for larger screens
- **Flexible Grids**: CSS Grid with auto-fit and minmax
- **Collapsible Sidebars**: Sidebar collapses to icon-only on mobile
- **Stacked Components**: Components stack vertically on small screens

### Touch Considerations

- **Touch Targets**: Minimum 44px × 44px for interactive elements
- **Gesture Support**: Swipe, pinch, and tap gestures where appropriate
- **Scroll Behavior**: Smooth scrolling with momentum on touch devices

---

## 🔄 Interaction Patterns

### Loading States

- **Initial Load**: Full-page skeleton or spinner
- **Data Fetching**: Inline loading indicators
- **Form Submission**: Button loading states with disabled inputs
- **Navigation**: Page transition animations

### Feedback Patterns

- **Success**: Green checkmarks, success messages, auto-dismiss
- **Error**: Red error messages with specific guidance
- **Warning**: Yellow warnings with action recommendations
- **Info**: Blue informational messages with context

### Animation Guidelines

- **Duration**: Fast (150ms), Standard (300ms), Slow (500ms)
- **Easing**: Ease-out for entering, ease-in for exiting
- **Transitions**: Smooth transitions for state changes
- **Micro-interactions**: Subtle animations for user feedback

---

## 🎯 Status & State Indicators

### Agent Status

- **Active**: Green dot (#22c55e) with "Active" label
- **Idle**: Yellow dot (#eab308) with "Idle" label
- **Offline**: Gray dot (#6b7280) with "Offline" label
- **Error**: Red dot (#ef4444) with "Error" label

### System Status

- **Healthy**: Green (#22c55e) - All systems operational
- **Warning**: Yellow (#eab308) - Minor issues detected
- **Critical**: Red (#ef4444) - Major issues requiring attention
- **Maintenance**: Blue (#3b82f6) - Scheduled maintenance

### Data States

- **Loading**: Skeleton loaders or spinners
- **Empty**: Illustrations with helpful text
- **Error**: Error messages with retry options
- **Success**: Success confirmations with next steps

---

## 🔐 Security & Accessibility

### Security Indicators

- **Authentication**: Clear login/logout states
- **Permissions**: Visual indicators for access levels
- **Data Privacy**: Clear data handling information
- **Session Management**: Session timeout warnings

### Accessibility Features

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Proper ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliance (4.5:1 ratio)
- **Focus Management**: Clear focus indicators and logical tab order

---

## 📊 Data Visualization Standards

### Charts & Graphs

- **Color Coding**: Consistent color schemes for data types
- **Responsive**: Charts adapt to container size
- **Interactive**: Hover states, zoom, and filtering
- **Accessible**: Screen reader descriptions and keyboard navigation

### Tables & Lists

- **Sorting**: Clear sort indicators and multi-column sorting
- **Filtering**: Advanced filtering with multiple criteria
- **Pagination**: Page navigation with item counts
- **Selection**: Row selection with bulk actions

---

## 🚀 Performance Guidelines

### Loading Performance

- **Initial Load**: < 3 seconds on 3G connection
- **Interaction**: < 100ms response time for user actions
- **Navigation**: < 500ms for page transitions
- **Data Fetching**: < 1 second for API responses

### Optimization Techniques

- **Lazy Loading**: Load components and data as needed
- **Code Splitting**: Split bundles by route and feature
- **Caching**: Implement proper caching strategies
- **Compression**: Optimize images and assets

---

This design system ensures consistency across all TeamHub views while providing a solid foundation for development. Each view-specific prompt will reference these standards to create cohesive, professional interfaces.
