# ⚡ Workflows Section UI Specifications

The Workflows section provides n8n workflow integration and management capabilities.

---

## 9. Workflows → Design Tab

**Flow**: When clicking Workflows tab → Design tab, opens full-screen n8n workflow designer with visual workflow builder.

**Layout (100% screen width, 100% height)**:

- **Top Toolbar (8% height)**: Workflow actions, save, deploy, test, import/export
- **Left Sidebar (20% width)**: Node library with categories and search
- **Main Canvas (80% width)**: Workflow design area with grid and zoom controls
- **Right Sidebar (20% width)**: Node configuration and properties
- **Bottom Panel (12% height)**: Execution logs, validation messages, debug tools

**Components Needed**:

- **n8n Workflow Canvas**: Full-screen canvas with grid system, zoom controls, pan functionality
- **Node Library**: Categorized nodes (Triggers, Actions, Logic, Data, Integrations)
- **Node Configuration**: Parameter forms, validation, testing interface
- **Connection Management**: Visual connection lines, data flow indicators, error highlighting
- **Workflow Validation**: Real-time validation, error checking, best practice suggestions

**Sample Data**:

- **Available Nodes**: Webhook Trigger, HTTP Request, Database Query, Email Send, Slack Message, File Operations
- **Sample Workflows**: "Daily Safety Report", "Material Order Automation", "Progress Update Notifications", "Invoice Generation"
- **Node Categories**: Triggers (Webhook, Schedule, Manual), Actions (HTTP, Database, Email), Logic (If/Else, Switch, Loop)

---

## 10. Workflows → Templates Tab

**Flow**: When clicking Workflows tab → Templates tab, shows workflow template library with categories and import functionality.

**Layout (100% screen width, 100% height)**:

- **Top Section (15% height)**: Template search, categories, and creation tools
- **Main Grid (70% height)**: Template cards in responsive grid layout
- **Right Sidebar (15% width)**: Template details and import options
- **Bottom Section (15% height)**: Template management and bulk actions

**Components Needed**:

- **Template Library**: Grid of template cards with previews, descriptions, and ratings
- **Template Categories**: Project Management, Safety & Compliance, Financial, Communication, Integration
- **Template Search**: Search by name, category, tags, or functionality
- **Template Import**: One-click import with configuration options
- **Template Management**: Edit, duplicate, and delete templates

**Sample Data**:

- **Template Categories**: Project Management (12), Safety & Compliance (8), Financial (6), Communication (10), Integration (15)
- **Popular Templates**: "Customer Onboarding", "Invoice Processing", "Safety Checklist", "Team Notifications"
- **Template Ratings**: 4.5/5 average rating across all templates
