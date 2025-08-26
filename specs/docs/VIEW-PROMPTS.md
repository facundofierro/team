# TeamHub View-Specific Prompts

## Overview

This document contains all 30 view-specific prompts for TeamHub. Each prompt references the `DESIGN-SYSTEM.md` for common elements and focuses only on unique components and interactions.

**Reference**: Always use `specs/docs/DESIGN-SYSTEM.md` for common technical requirements, design standards, and UI patterns.

---

## 🏢 Sample Demo Organization: ConstructCorp

### Company Profile

**ConstructCorp** is a B2B construction company specializing in apartment buildings and commercial edification projects. They work as contractors for real estate developers, handling the entire construction process from foundation to completion.

### Business Operations

- **Project Management**: Multiple construction sites simultaneously
- **Material Procurement**: Bulk purchasing, supplier management, inventory tracking
- **Human Resources**: Construction crews, engineers, project managers, safety officers
- **Communication**: Client updates, progress reports, change orders, compliance documentation
- **Quality Control**: Safety inspections, building codes compliance, quality assurance
- **Financial Management**: Project budgets, cost tracking, invoicing, payroll

### Agent Hierarchy & Specializations

#### Executive Level

1. **CEO Agent** - Strategic planning, company overview, executive decisions
2. **CFO Agent** - Financial analysis, budget management, cost optimization
3. **COO Agent** - Operations management, resource allocation, efficiency optimization

#### Management Level

4. **Project Manager Agent** - Project coordination, timeline management, resource allocation
5. **HR Manager Agent** - Employee management, recruitment, compliance, safety training
6. **Procurement Agent** - Material sourcing, supplier management, cost negotiation
7. **Quality Control Agent** - Safety compliance, building codes, quality standards
8. **Legal & Compliance Agent** - Contract review, regulatory compliance, risk management
9. **Marketing & PR Agent** - Client relations, public relations, brand management
10. **IT & Systems Agent** - Technology infrastructure, software management, cybersecurity

#### Operational Level

11. **Site Supervisor Agent** - Daily operations, crew management, progress tracking
12. **Safety Officer Agent** - Safety protocols, incident reporting, training coordination
13. **Logistics Agent** - Material delivery, equipment management, site coordination
14. **Equipment Manager Agent** - Heavy machinery, maintenance scheduling, operator training
15. **Environmental Agent** - Environmental compliance, sustainability, waste management
16. **Subcontractor Agent** - Subcontractor management, quality assurance, payment processing
17. **Client Relations Agent** - Client communication, progress updates, change order management
18. **Training Coordinator Agent** - Safety training, skill development, certification management
19. **Inventory Manager Agent** - Material tracking, stock levels, reorder management

### Sample Data for Demo

#### Projects

- **Riverside Apartments** (Phase 1) - 120 units, 60% complete
- **Downtown Office Complex** - 15 floors, 80% complete
- **Suburban Mall** - 200,000 sq ft, 40% complete
- **Harbor View Condos** - 80 units, planning phase

#### Materials & Suppliers

- **Concrete**: MetroMix Concrete Co. (Primary), CityCement (Backup)
- **Steel**: SteelCorp Industries, Regional Steel Supply
- **Electrical**: PowerTech Solutions, Metro Electric
- **Plumbing**: AquaFlow Systems, City Plumbing Supply

#### Team Members

- **Project Managers**: Sarah Chen, Mike Rodriguez, Lisa Thompson
- **Engineers**: David Kim, Maria Santos, James Wilson
- **Site Supervisors**: Tom Johnson, Carlos Mendez, Anna Kowalski
- **Safety Officers**: Robert Davis, Jennifer Lee

#### Financial Data

- **Annual Revenue**: $45M
- **Active Projects Value**: $120M
- **Material Costs**: $18M annually
- **Labor Costs**: $22M annually
- **Profit Margin**: 12%

---

## 🏠 Dashboard Section (3 Views)

### 1. Dashboard → Overview Tab

**Flow**: When clicking Dashboard tab → Overview tab loads automatically showing company-wide metrics and recent activities.

**Layout (100% screen width, 100% height)**:

- **Top Section (15% height)**: Company header with ConstructCorp logo, current date/time, weather widget
- **Main Grid (80% height)**: 3-column responsive grid
  - **Column 1 (33% width)**: System health cards, quick actions
  - **Column 2 (33% width)**: Project status overview, financial summary
  - **Column 3 (33% width)**: Recent activities, alerts, notifications
- **Bottom Section (5% height)**: Footer with system status, last sync time

**Components Needed**:

- **System Health Cards**: CPU usage (45%), Memory (62%), Database (98%), Services (All Green)
- **Quick Action Buttons**: "New Project", "Schedule Meeting", "Generate Report", "Emergency Contact"
- **Project Status Widget**: 4 active projects with completion percentages and next milestones
- **Financial Summary**: Revenue vs. budget, material costs, labor costs, profit margin
- **Recent Activities Feed**: Last 10 activities with timestamps (project updates, material deliveries, safety inspections)
- **Alert System**: 2 active alerts (Material shortage at Riverside site, Safety inspection due tomorrow)

**Sample Data**:

- **System Status**: All systems operational, last backup 2 hours ago
- **Active Alerts**: "Steel delivery delayed - Riverside project", "Safety inspection overdue - Downtown site"
- **Recent Activity**: "Material delivery completed - Suburban Mall", "Progress report sent - Harbor View project"

### 2. Dashboard → Widgets Tab

**Flow**: When clicking Dashboard tab → Widgets tab, shows customizable dashboard builder with drag-and-drop functionality.

**Layout (100% screen width, 100% height)**:

- **Left Panel (25% width)**: Widget library with categories (Project, Financial, Operational, Custom)
- **Main Canvas (60% width)**: Dashboard building area with 12x8 grid system
- **Right Panel (15% width)**: Widget configuration and properties
- **Top Toolbar (5% height)**: Save, load, reset, preview, export buttons

**Components Needed**:

- **Widget Library**: Categorized widgets (Project Timeline, Cost Tracker, Safety Metrics, Weather, Calendar)
- **Widget Canvas**: 12x8 grid with snap-to-grid functionality, widget resize handles
- **Configuration Panel**: Widget-specific settings, data source selection, refresh intervals
- **Widget Preview**: Real-time preview of configured widgets with sample data
- **Layout Manager**: Save/load dashboard configurations, template library

**Sample Data**:

- **Available Widgets**: Project Timeline, Cost Tracker, Safety Metrics, Weather Widget, Calendar, Team Status, Material Inventory, Equipment Status
- **Widget Templates**: Executive Dashboard, Project Manager View, Site Supervisor View, Financial Overview

### 3. Dashboard → Analytics Tab

**Flow**: When clicking Dashboard tab → Analytics tab, displays comprehensive analytics dashboard with interactive charts and KPIs.

**Layout (100% screen width, 100% height)**:

- **Top Section (20% height)**: Key KPI cards in horizontal row (Revenue, Projects, Safety Score, Efficiency)
- **Middle Section (60% height)**: Interactive charts and graphs in 2x2 grid
- **Bottom Section (20% height)**: Detailed metrics table and export controls

**Components Needed**:

- **KPI Dashboard**: 4 main metrics with trend indicators and comparison to previous period
- **Interactive Charts**: Line charts (Revenue trends), Bar charts (Project progress), Pie charts (Cost breakdown), Heat maps (Site activity)
- **Performance Comparison**: Month-over-month, quarter-over-quarter, year-over-year comparisons
- **Goal Tracking**: Progress bars for annual targets with visual indicators
- **Custom Metric Builder**: Formula builder for custom calculations

**Sample Data**:

- **KPIs**: Revenue ($3.8M this month, +12% vs last month), Active Projects (4), Safety Score (94/100), Efficiency Rating (87%)
- **Charts**: Revenue trend showing 15% growth Q1-Q2, Project completion rates by site, Material cost breakdown by category

---

## 🤖 Agents Section (5 Views)

### 4. Agents → Chat Tab

**Flow**: When clicking Agents tab → Chat tab, loads agent chat interface with left panel showing available agents and right panel showing chat conversation.

**Layout (100% screen width, 100% height)**:

- **Left Panel (30% width)**: Agent list with search, filter, and status indicators
- **Right Panel (70% width)**: Chat interface with message history and input
- **Memory Bar (5% height)**: Context memory selection below chat header
- **Input Area (10% height)**: Message input with tool selection and send button

**Agent List Panel Structure**:

- **Panel Header**: "Agents" title with control icons (list view, graph view, search, filter, "+ New" button)
- **Status Filter Tabs**: "All (19)", "Online (8)", "Busy (6)", "Off (5)"
- **Agent Tree**: Hierarchical structure with expandable/collapsible parent-child relationships
- **Status Indicators**: Green dot (Online), Yellow dot (Busy), Grey dot (Offline)
- **Bottom Status Bar**: "19 agents • 8 online" and "Connected" with green indicator

**Chat Panel Structure**:

- **Chat Header**: Chat title "Riverside Apartments Project Status", active agent "with Project Manager Agent • Online"
- **Active Memories Bar**: Clickable memory tags below chat title
- **Message Area**: Chat conversation with agent responses
- **Input Section**: Message input field with controls and status indicators

**Components Needed**:

- **Agent List Panel**: Hierarchical tree structure with expandable parent/child agents, status indicators (green=Online, yellow=Busy, grey=Offline), role badges, last activity
- **Chat Interface**: Message thread with timestamps, agent avatars, message types (text, tool calls, results), chat title bar
- **Chat Header**: Chat title, active agent name with status, timestamp
- **Memory Selection**: Active memories bar with clickable tags below chat title
- **Message Input**: Rich text input with tool picker, file attachment, voice input, AI model selector (GPT-4), send button
- **Input Controls**: Paperclip (attachments), microphone (voice), AI model dropdown, send button with paper plane icon
- **Input Status**: Timestamp and token count above input field
- **Chat Controls**: Clear chat, export conversation, save to documents
- **Agent Hierarchy**: Parent agents with expandable child agents (e.g., Procurement Manager → Material Sourcer, Vendor Negotiator)

**Sample Data**:

- **Agent Hierarchy Structure**:

  - **Procurement Manager** (Parent Agent - Online) → "Materials sourcing and supplier management"
    - **Material Sourcer** (Child Agent - Online) → "Finds and evaluates construction materials"
    - **Vendor Negotiator** (Child Agent - Busy) → "Negotiates contracts with suppliers"
  - **Business Development** (Parent Agent - Online) → "Client acquisition and market research"
    - **Lead Generator** (Child Agent - Online) → "Identifies potential commercial clients"
    - **Market Analyst** (Child Agent - Offline) → "Market trends and competitor analysis"
  - **HR Manager** (Parent Agent - Offline) → "Employee management and workforce planning"
    - **Recruiter** (Child Agent - Offline) → "Finds skilled construction workers"
    - **Safety Coordinator** (Child Agent - Busy) → "Ensures workplace safety compliance"
    - **Training Manager** (Child Agent - Online) → "Employee development and certification"
  - **Project Manager** (Parent Agent - Online) → "Project coordination and timeline management"
    - **Site Coordinator** (Child Agent - Online) → "Daily site operations and crew management"
    - **Progress Tracker** (Child Agent - Busy) → "Project milestone and timeline tracking"
  - **Legal & Compliance** (Parent Agent - Online) → "Contract review and regulatory compliance"
    - **Contract Specialist** (Child Agent - Online) → "Contract drafting and legal review"
    - **Compliance Officer** (Child Agent - Busy) → "Regulatory compliance and audits"

- **Chat Title & Context**:

  - **Chat Title**: "Riverside Apartments Project Status"
  - **Active Agent**: "with Project Manager Agent • Online"
  - **Active Memories**: "Riverside Project", "Project Timeline", "Safety Protocols", "Material Inventory", "Budget Q2 2025"

- **Agent Status Summary**:

  - **Total Agents**: 19 agents
  - **Status Breakdown**: 8 Online, 6 Busy, 5 Offline
  - **Connection Status**: "Connected" with green indicator

- **Sample Conversation**:

```
User: "Can you help me analyze this quarterly sales data and identify the top 3 growth opportunities?"

Agent: "Absolutely! I've analyzed your Q3 sales data and found three key opportunities:

1. **Product A** - 47% growth potential by expanding to the Midwest region
2. **Service B** - 32% increase possible through upselling to existing customers
3. **Market C** - 28% growth by targeting small businesses

I've prepared a detailed action plan with ROI projections. Would you like me to create a presentation deck for your team meeting tomorrow?"

*[Agent demonstrates: Data analysis, strategic insights, proactive planning, and business acumen]*
```

### 5. Agents → Configuration Tab

**Flow**: When clicking Agents tab → Configuration tab, shows agent management interface with creation wizard and configuration forms.

**Layout (100% screen width, 100% height)**:

- **Left Panel (35% width)**: Agent list, creation button, agent categories
- **Right Panel (65% width)**: Configuration forms, wizard steps, agent settings
- **Top Section (15% height)**: Agent header with name, role, status, edit/save buttons
- **Main Area (80% height)**: Tabbed configuration interface
- **Bottom Section (5% height)**: Action buttons (Save, Test, Deploy, Delete)

**Components Needed**:

- **Agent Creation Wizard**: 5-step wizard (Basic Info, Role Definition, System Prompt, Tool Assignment, Testing)
- **Agent Settings Forms**: Name, description, role, permissions, behavior policies
- **System Prompt Editor**: Rich text editor with AI assistance, prompt templates, character count
- **Behavior Policies**: Response style, safety filters, compliance rules, escalation procedures
- **Tool Assignment**: Drag-and-drop tool assignment, permission levels, usage limits

**Sample Data**:

- **Agent Templates**:
  - **Procurement Manager** (Parent) - Materials sourcing and supplier management
    - **Material Sourcer** (Child) - Finds and evaluates construction materials
    - **Vendor Negotiator** (Child) - Negotiates contracts with suppliers
  - **Business Development** (Parent) - Client acquisition and market research
    - **Lead Generator** (Child) - Identifies potential commercial clients
  - **Contract Specialist** (Standalone) - Contract drafting and legal compliance
  - **HR Manager** (Parent) - Employee management and workforce planning
    - **Recruiter** (Child) - Finds skilled construction workers
    - **Safety Coordinator** (Child) - Ensures workplace safety compliance
- **System Prompts**: "You are a construction project manager with 15 years experience in residential and commercial projects...", "You are a legal compliance specialist with expertise in construction law, OSHA regulations, and contract management...", "You are an IT systems manager responsible for construction technology infrastructure, cybersecurity, and software management..."
- **Available Tools**: Project Tracker, Cost Calculator, Safety Checklist, Material Database, Communication Hub, Legal Database, Compliance Tracker, IT Management Suite, Equipment Tracker, Environmental Monitor, Subcontractor Portal, Client Portal, Training Management, Inventory System

### 6. Agents → Performance Tab

**Flow**: When clicking Agents tab → Performance tab, displays comprehensive performance analytics and optimization recommendations.

**Layout (100% screen width, 100% height)**:

- **Top Section (25% height)**: Performance overview cards (Response Time, Accuracy, Usage, Efficiency)
- **Middle Section (60% height)**: Detailed analytics charts and performance metrics
- **Bottom Section (15% height)**: Optimization suggestions and action items

**Components Needed**:

- **Performance Metrics Dashboard**: 4 key metrics with trend indicators and benchmarks
- **Usage Analytics Charts**: Line charts showing agent usage over time, response time distribution
- **Response Time Monitoring**: Real-time monitoring with alerts for slow responses
- **Quality Assessment**: Accuracy scores, user satisfaction ratings, error analysis
- **Performance Optimization**: AI-powered suggestions for improving agent performance

**Sample Data**:

- **Performance Metrics**: Average Response Time (2.3s), Accuracy Score (94%), Usage Count (1,247 interactions), Efficiency Rating (89%)
- **Trends**: Response time improved 15% this month, accuracy increased 3%, usage up 22% from last month
- **Optimization Suggestions**: "Consider adding more safety protocols to Safety Officer agent", "Project Manager agent could benefit from additional cost analysis tools"

### 7. Agents → Instances Tab

**Flow**: When clicking Agents tab → Instances tab, shows agent instance management with cloning and resource allocation controls.

**Layout (100% screen width, 100% height)**:

- **Top Section (20% height)**: Instance overview and creation controls
- **Main Grid (70% height)**: Instance cards in responsive grid layout
- **Bottom Section (10% height)**: Bulk actions and resource monitoring

**Components Needed**:

- **Instance Management Dashboard**: Overview of all agent instances with status indicators
- **Instance Cards**: Individual cards showing agent name, instance ID, status, resource usage, last activity
- **Instance Cloning Tools**: Clone existing instances with configuration options
- **Resource Allocation Controls**: CPU, memory, and storage allocation sliders
- **Instance Performance Comparison**: Side-by-side comparison of instance performance

**Sample Data**:

- **Active Instances**: CEO Agent (Instance 1 - Production, Instance 2 - Testing), Project Manager Agent (Instance 1 - Production, Instance 3 - Development)
- **Resource Usage**: CEO Agent Instance 1 (CPU: 15%, Memory: 2.1GB, Storage: 500MB)
- **Instance Status**: 8 instances running, 2 instances stopped, 1 instance error

### 8. Agents → Tools Tab

**Flow**: When clicking Agents tab → Tools tab, displays tool management interface with assignment and configuration capabilities.

**Layout (100% screen width, 100% height)**:

- **Left Panel (40% width)**: Available tools library with categories and search
- **Right Panel (60% width)**: Tool assignment interface and configuration panel
- **Top Section (15% height)**: Tool overview and assignment controls
- **Main Area (80% height)**: Tool configuration and usage analytics
- **Bottom Section (5% height)**: Save and apply buttons

**Components Needed**:

- **Tool Assignment Interface**: Drag-and-drop tool assignment to agents with permission levels
- **Tool Configuration Panel**: Parameter configuration, API keys, usage limits, error handling
- **Tool Usage Analytics**: Usage statistics, performance metrics, error rates
- **Custom Tool Development**: Tool creation interface, testing environment, deployment options
- **Tool Permission Management**: Role-based access control, usage restrictions, audit logging

**Sample Data**:

- **Available Tools**: Project Tracker, Cost Calculator, Safety Checklist, Material Database, Communication Hub, Weather API, Calendar Integration
- **Tool Assignments**: Project Manager Agent (Project Tracker, Cost Calculator, Communication Hub), Safety Officer Agent (Safety Checklist, Material Database)
- **Usage Analytics**: Project Tracker used 342 times this month, Cost Calculator used 156 times, Safety Checklist used 89 times

---

## ⚡ Workflows Section (5 Views)

### 9. Workflows → Design Tab

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

### 10. Workflows → Templates Tab

**Flow**: When clicking Workflows tab → Templates tab, shows workflow template library with categories and import functionality.

**Layout (100% screen width, 100% height)**:

- **Top Section (15% height)**: Template search, categories, and creation tools
- **Main Grid (70% height)**: Template cards in responsive grid layout
- **Right Sidebar (15% width)**: Template details and import options
- **Bottom Section (15% height)**: Template management and bulk actions

**Components Needed**:

- **Template Library**: Grid of template cards with previews, descriptions, and ratings
- **Template Categories**: Project Management, Safety & Compliance, Financial, Communication, Integration
- **Template Preview**: Workflow diagrams, description, requirements, estimated setup time
- **Import/Export Tools**: One-click import, configuration wizard, export to other systems
- **Custom Template Creation**: Template builder, sharing options, version control

**Sample Data**:

- **Available Templates**: "Daily Safety Report Generator", "Material Order Workflow", "Progress Update Automation", "Invoice Processing", "Client Communication Hub"
- **Template Ratings**: 4.8/5 stars average, 127 downloads, 89% success rate
- **Categories**: Project Management (15 templates), Safety & Compliance (8 templates), Financial (12 templates), Communication (6 templates)

### 11. Workflows → Execution Tab

**Flow**: When clicking Workflows tab → Execution Tab, displays workflow execution monitoring and management interface.

**Layout (100% screen width, 100% height)**:

- **Top Section (20% height)**: Execution overview, active workflows, and control buttons
- **Middle Section (60% height)**: Execution history table with filtering and search
- **Bottom Section (20% height)**: Debug tools, logs, and troubleshooting interface

**Components Needed**:

- **Execution Monitor Dashboard**: Real-time overview of active workflow executions
- **Run History Table**: Sortable table with execution ID, workflow name, status, duration, start time
- **Debug Tools**: Step-by-step execution viewer, variable inspection, error analysis
- **Execution Statistics**: Success rates, average duration, error frequency, performance trends
- **Error Handling Interface**: Error details, retry options, escalation procedures

**Sample Data**:

- **Active Executions**: "Daily Safety Report" (Running - 45% complete), "Material Order" (Completed), "Progress Update" (Failed - Retrying)
- **Execution History**: 1,247 total executions, 1,189 successful, 58 failed, 95.3% success rate
- **Performance Metrics**: Average execution time 2.3 minutes, fastest execution 45 seconds, slowest execution 12 minutes

### 12. Workflows → Integrations Tab

**Flow**: When clicking Workflows tab → Integrations tab, shows external system connections and integration management.

**Layout (100% screen width, 100% height)**:

- **Left Panel (30% width)**: Available integrations and connection status
- **Right Panel (70% width)**: Integration configuration and testing interface
- **Top Section (15% height)**: Integration overview and connection controls
- **Main Area (80% height)**: Configuration forms and testing tools
- **Bottom Section (5% height)**: Save, test, and deploy buttons

**Components Needed**:

- **Integration Connection Manager**: List of available integrations with connection status
- **Trigger Configuration**: Webhook setup, schedule configuration, event triggers
- **Data Mapping Tools**: Visual data mapping between systems, field mapping, transformation rules
- **Integration Testing**: Test connection, validate data flow, error simulation
- **Connection Status Monitoring**: Health checks, uptime monitoring, performance metrics

**Sample Data**:

- **Available Integrations**: Slack, Microsoft Teams, Email, SMS, Google Sheets, QuickBooks, Salesforce, Construction Management Software
- **Connection Status**: Slack (Connected), Email (Connected), QuickBooks (Connected), Salesforce (Disconnected - Error)
- **Integration Types**: Communication (Slack, Teams, Email), Financial (QuickBooks, Stripe), Project Management (Asana, Trello)

### 13. Workflows → Analytics Tab

**Flow**: When clicking Workflows tab → Analytics tab, displays comprehensive workflow performance analytics and optimization insights.

**Layout (100% screen width, 100% height)**:

- **Top Section (25% height)**: Key performance metrics and KPI cards
- **Middle Section (60% height)**: Interactive charts and detailed analytics
- **Bottom Section (15% height)**: Optimization recommendations and action items

**Components Needed**:

- **Performance Metrics Dashboard**: 4 main KPIs with trend indicators and benchmarks
- **Execution Analytics Charts**: Line charts for execution trends, bar charts for workflow performance
- **Bottleneck Identification**: Visual identification of slow steps, resource usage analysis
- **Optimization Suggestions**: AI-powered recommendations for workflow improvements
- **Cost Analysis Tools**: Execution cost tracking, resource utilization, ROI calculations

**Sample Data**:

- **Performance KPIs**: Success Rate (95.3%), Average Execution Time (2.3 min), Cost per Execution ($0.15), ROI (340%)
- **Trends**: Success rate improved 2.1% this month, execution time reduced 18%, costs decreased 12%
- **Optimization Suggestions**: "Consider parallel execution for Material Order workflow", "Add retry logic for failed email notifications"

---

## 📊 Data Hub Section (5 Views)

### 14. Data Hub → Tables Tab

**Flow**: When clicking Data Hub tab → Tables tab, shows database table management interface with creation and data management tools.

**Layout (100% screen width, 100% height)**:

- **Left Panel (30% width)**: Table list, creation button, and table categories
- **Right Panel (70% width)**: Table structure editor and data management
- **Top Section (15% height)**: Table overview and management controls
- **Main Area (80% height)**: Table structure and data interface
- **Bottom Section (5% height)**: Save, import, export, and delete buttons

**Components Needed**:

- **Table List**: Searchable list of existing tables with record counts and last modified dates
- **Table Creation Wizard**: 4-step wizard (Table Name, Fields, Relationships, Indexes)
- **Table Structure Editor**: Visual field editor with data types, constraints, and validation rules
- **Data Import/Export**: CSV/JSON import, data validation, export options
- **AI Data Population**: AI-powered data generation, sample data creation, data quality assessment

**Sample Data**:

- **Existing Tables**: Projects (1,247 records), Materials (5,689 records), Employees (342 records), Suppliers (89 records), Safety Incidents (156 records)
- **Table Structure**: Projects table with fields (ID, Name, Location, Start Date, End Date, Budget, Status, Manager)
- **Sample Records**: "Riverside Apartments", "Downtown Office Complex", "Suburban Mall", "Harbor View Condos"

### 15. Data Hub → Research Tab

**Flow**: When clicking Data Hub tab → Research tab, displays AI research tools for data gathering and market analysis.

**Layout (100% screen width, 100% height)**:

- **Top Section (20% height)**: Research task creation and configuration
- **Middle Section (60% height)**: Active research tasks and progress monitoring
- **Bottom Section (20% height)**: Research history, results, and data quality assessment

**Components Needed**:

- **AI Research Interface**: Research task creation form with parameters and objectives
- **Research Templates**: Pre-built research templates for common business needs
- **Data Gathering Workflows**: Automated data collection, validation, and processing
- **Research History**: Completed research tasks with results and insights
- **Data Quality Assessment**: AI-powered data validation, completeness checks, accuracy scoring

**Sample Data**:

- **Research Templates**: "Market Analysis", "Supplier Research", "Competitor Analysis", "Regulatory Compliance", "Cost Benchmarking"
- **Active Research**: "Steel supplier market analysis" (75% complete), "Safety equipment cost comparison" (90% complete)
- **Research Results**: "Market Analysis Q2 2025" (Completed), "Supplier Evaluation Report" (Completed), "Cost Benchmarking Study" (In Progress)

### 16. Data Hub → Analytics Tab

**Flow**: When clicking Data Hub tab → Analytics tab, shows business intelligence tools with data visualization and analysis capabilities.

**Layout (100% screen width, 100% height)**:

- **Top Section (15% height)**: Analytics overview and quick insights
- **Main Canvas (70% height)**: Interactive visualization area with chart library
- **Right Sidebar (15% width)**: Chart configuration and data source selection
- **Bottom Section (15% height)**: Statistical analysis tools and export options

**Components Needed**:

- **Data Visualization Tools**: Interactive charts, graphs, and dashboards
- **Chart Library**: Bar charts, line charts, pie charts, scatter plots, heat maps, geographic visualizations
- **Interactive Dashboards**: Drill-down capabilities, filtering, real-time updates
- **Statistical Analysis Tools**: Correlation analysis, trend detection, outlier identification
- **Data Exploration Interface**: Ad-hoc query builder, data slicing, dimension analysis

**Sample Data**:

- **Available Charts**: Project Progress Timeline, Cost Distribution Pie Chart, Safety Incident Trend Line, Material Usage Bar Chart
- **Sample Insights**: "Material costs increased 8% this quarter", "Safety incidents decreased 23% year-over-year", "Project completion rate improved 15%"
- **Data Sources**: Projects table, Materials table, Safety Incidents table, Financial records, Employee performance data

### 17. Data Hub → Reports Tab

**Flow**: When clicking Data Hub tab → Reports tab, displays report generation interface with templates and scheduling capabilities.

**Layout (100% screen width, 100% height)**:

- **Left Panel (25% width)**: Report templates and categories
- **Main Area (60% width)**: Report builder canvas and configuration
- **Right Panel (15% width)**: Report properties and scheduling options
- **Top Section (10% height)**: Report management controls
- **Bottom Section (15% height)**: Preview, save, and distribution options

**Components Needed**:

- **Report Builder Interface**: Drag-and-drop report designer with sections and components
- **Report Templates**: Pre-built templates for common business reports
- **Scheduled Reports**: Automated report generation and distribution
- **Report Distribution**: Email distribution, file sharing, dashboard publishing
- **Export Options**: PDF, Excel, PowerPoint, HTML, CSV formats

**Sample Data**:

- **Report Templates**: "Monthly Project Status", "Quarterly Financial Summary", "Annual Safety Report", "Supplier Performance Review"
- **Scheduled Reports**: "Weekly Progress Update" (Every Monday), "Monthly Financial Summary" (1st of month), "Quarterly Safety Review" (Quarterly)
- **Report Types**: Executive Summary, Detailed Analysis, Operational Reports, Compliance Reports, Performance Dashboards

### 18. Data Hub → Vector Search Tab

**Flow**: When clicking Data Hub tab → Vector Search tab, shows AI-powered semantic search interface with vector query capabilities.

**Layout (100% screen width, 100% height)**:

- **Top Section (20% height)**: Search interface with query builder and filters
- **Middle Section (60% height)**: Search results display with relevance scoring
- **Bottom Section (20% height)**: Search analytics and optimization tools

**Components Needed**:

- **Semantic Search Interface**: Natural language search with AI understanding
- **Vector Query Builder**: Advanced query construction with similarity thresholds
- **Search Results Display**: Ranked results with relevance scores and snippets
- **Similarity Scoring**: Visual similarity indicators, confidence levels
- **Search Analytics**: Search performance metrics, popular queries, optimization suggestions

**Sample Data**:

- **Sample Queries**: "Projects with safety incidents", "Materials with cost overruns", "Employees working overtime", "Suppliers with delivery delays"
- **Search Results**: "Riverside Apartments - 3 safety incidents reported", "Steel delivery delayed by 2 weeks", "Site supervisor working 60+ hours weekly"
- **Search Analytics**: 1,247 searches this month, 89% query success rate, average response time 1.2 seconds

---

## 📄 Documents Section (5 Views)

### 19. Documents → Files Tab

**Flow**: When clicking Documents tab → Files tab, loads document management interface with folder navigation and file operations.

**Layout (100% screen width, 100% height)**:

- **Left Panel (25% width)**: Folder tree navigation and document categories
- **Right Panel (75% width)**: File list, preview, and operations
- **Top Section (10% height)**: Search, filter, and view options
- **Main Area (80% height)**: File grid/list with thumbnails and metadata
- **Bottom Section (10% height)**: File properties and bulk actions

**Components Needed**:

- **Document Explorer**: Hierarchical folder structure with expand/collapse
- **Folder Navigation**: Breadcrumb navigation, recent folders, favorites
- **File Operations**: Create, move, delete, rename, copy, share files
- **Search and Filtering**: Full-text search, file type filters, date ranges, size filters
- **File Properties Panel**: Metadata display, version history, permissions, sharing settings

**Sample Data**:

- **Folder Structure**: Projects → Riverside Apartments → Plans, Riverside Apartments → Contracts, Riverside Apartments → Safety Reports
- **File Types**: PDF documents (45%), CAD drawings (23%), Excel spreadsheets (18%), Word documents (14%)
- **Recent Files**: "Safety Protocol Q2 2025.pdf", "Material Cost Analysis.xlsx", "Project Timeline.pptx", "Site Inspection Report.docx"

### 20. Documents → Templates Tab

**Flow**: When clicking Documents tab → Templates tab, shows AI document generation interface with template library and creation tools.

**Layout (100% screen width, 100% height)**:

- **Left Panel (30% width)**: Template library with categories and search
- **Main Area (50% width)**: AI generation interface and document preview
- **Right Panel (20% width)**: Template creation and customization tools
- **Top Section (15% height)**: Generation controls and template management
- **Bottom Section (15% height)**: Save, export, and sharing options

**Components Needed**:

- **AI Document Generator**: Natural language input, content suggestions, style options
- **Template Library**: Categorized templates with previews and descriptions
- **Custom Template Creation**: Template builder with sections, formatting, and variables
- **Generation History**: Track generated documents, versions, and modifications
- **Template Categories**: Project Reports, Safety Documents, Financial Reports, Communication Templates

**Sample Data**:

- **Available Templates**: "Project Progress Report", "Safety Incident Report", "Material Order Form", "Client Communication Letter", "Employee Performance Review"
- **AI Generation Examples**: "Generate a safety report for Riverside project", "Create a cost analysis for steel materials", "Write a client update for Downtown project"
- **Template Categories**: Project Management (12 templates), Safety & Compliance (8 templates), Financial (6 templates), Communication (4 templates)

### 21. Documents → Collaboration Tab

**Flow**: When clicking Documents tab → Collaboration tab, displays team collaboration interface with real-time editing and commenting.

**Layout (100% screen width, 100% height)**:

- **Left Panel (20% width)**: Document list and collaboration status
- **Main Area (60% width)**: Document editor with real-time collaboration
- **Right Panel (20% width)**: Comments, version history, and collaboration tools
- **Top Section (10% height)**: Document header and collaboration controls
- **Bottom Section (10% height)**: Save, share, and export options

**Components Needed**:

- **Team Editing Interface**: Real-time collaborative editing with conflict resolution
- **Comment System**: Inline comments, threaded discussions, @mentions, notifications
- **Version Control**: Document versioning, change tracking, rollback capabilities
- **Approval Workflows**: Multi-stage approval processes, electronic signatures
- **Activity Tracking**: Real-time activity feed, user presence indicators, change notifications

**Sample Data**:

- **Active Collaborators**: Sarah Chen (Project Manager), Mike Rodriguez (Engineer), Lisa Thompson (Safety Officer)
- **Document Status**: "Safety Protocol Q2 2025" (In Review), "Material Cost Analysis" (Approved), "Project Timeline" (Draft)
- **Recent Comments**: "Update safety requirements for high-rise sections", "Add cost breakdown for electrical materials", "Include weather contingency plans"

### 22. Documents → External Tab

**Flow**: When clicking Documents tab → External tab, shows external integrations with Google Docs, Sheets, and other cloud services.

**Layout (100% screen width, 100% height)**:

- **Top Section (20% height)**: Integration status and connection management
- **Main Grid (60% height)**: Connected services and sync status
- **Bottom Section (20% height)**: Permission management and sync controls
- **Left Panel (25% width)**: Available integrations and connection options
- **Right Panel (75% width)**: Integration configuration and monitoring

**Components Needed**:

- **Google Docs Integration**: Document sync, real-time collaboration, version control
- **Google Sheets Integration**: Spreadsheet sync, data import/export, formula support
- **Other External Tools**: Microsoft Office, Dropbox, OneDrive, SharePoint
- **Sync Status Monitoring**: Real-time sync status, error reporting, conflict resolution
- **Permission Management**: Access control, sharing settings, security policies

**Sample Data**:

- **Connected Services**: Google Drive (Connected), Microsoft 365 (Connected), Dropbox (Connected), OneDrive (Disconnected)
- **Sync Status**: Google Docs (Synced - 2 minutes ago), Google Sheets (Syncing - 45% complete), Microsoft Word (Error - Authentication failed)
- **Shared Documents**: "Project Budget" (Google Sheets), "Safety Protocols" (Google Docs), "Site Plans" (AutoCAD)

### 23. Documents → Analytics Tab

**Flow**: When clicking Documents tab → Analytics tab, displays document usage analytics and collaboration insights.

**Layout (100% screen width, 100% height)**:

- **Top Section (25% height)**: Usage overview and key metrics
- **Middle Section (60% height)**: Analytics charts and detailed metrics
- **Bottom Section (15% height)**: Insights and recommendations
- **Left Panel (20% width)**: Analytics categories and filters
- **Right Panel (80% width)**: Main analytics dashboard

**Components Needed**:

- **Usage Metrics Dashboard**: Document views, edits, shares, downloads with trends
- **Collaboration Analytics**: Team collaboration patterns, editing frequency, comment activity
- **Access Pattern Analysis**: User access patterns, peak usage times, document popularity
- **Performance Metrics**: Document load times, sync performance, storage usage
- **User Engagement Tracking**: Active users, document interactions, feature adoption

**Sample Data**:

- **Usage Metrics**: 2,847 document views this month, 156 collaborative edits, 89 document shares, 234 downloads
- **Popular Documents**: "Safety Protocol Q2 2025" (156 views), "Project Budget" (134 views), "Site Plans" (98 views)
- **Collaboration Insights**: 67% of documents have multiple collaborators, average editing session is 23 minutes, peak collaboration time is 2-4 PM

---

## ⚙️ Settings Section (5 Views)

### 24. Settings → General Tab

**Flow**: When clicking Settings tab → General tab, loads general settings interface with user and organization management.

**Layout (100% screen width, 100% height)**:

- **Left Panel (25% width)**: Settings categories and navigation
- **Main Area (75% width)**: Configuration forms and settings panels
- **Top Section (15% height)**: Settings header and save controls
- **Content Area (80% height)**: Tabbed settings interface
- **Bottom Section (5% height)**: Action buttons and status indicators

**Components Needed**:

- **User Management Interface**: User list, role assignment, permission management
- **Organization Settings**: Company information, branding, contact details
- **System Preferences**: Language, timezone, date format, notification preferences
- **Profile Configuration**: Personal information, avatar, contact details
- **Notification Settings**: Email notifications, push notifications, alert preferences

**Sample Data**:

- **Organization Info**: ConstructCorp, Construction & Development, 500+ employees, $45M annual revenue
- **User Roles**: Administrators (3), Project Managers (12), Engineers (25), Site Supervisors (18), Safety Officers (8)
- **System Preferences**: English (US), Pacific Timezone, MM/DD/YYYY format, 24-hour time, Metric measurements

### 25. Settings → Security Tab

**Flow**: When clicking Settings tab → Security tab, shows security configuration and compliance management interface.

**Layout (100% screen width, 100% height)**:

- **Top Section (20% height)**: Security overview and threat monitoring
- **Main Area (70% height)**: Security settings and compliance configuration
- **Bottom Section (10% height)**: Security logs and audit information
- **Left Panel (20% width)**: Security categories and settings
- **Right Panel (80% width)**: Security configuration and monitoring

**Components Needed**:

- **Security Configuration Panel**: Password policies, MFA settings, session management
- **Compliance Settings**: Industry standards, regulatory requirements, audit trails
- **Audit Logs**: User activity logs, security events, access attempts
- **Access Control**: Role-based permissions, IP restrictions, device management
- **Authentication Methods**: SSO, OAuth, API keys, certificate management

**Sample Data**:

- **Security Status**: System secure, 2 failed login attempts today, MFA enabled for all users
- **Compliance Standards**: OSHA compliance, ISO 9001, LEED certification, Safety management system
- **Security Events**: 156 successful logins today, 2 failed attempts, 1 suspicious activity alert, 0 security incidents

### 26. Settings → Integrations Tab

**Flow**: When clicking Settings tab → Integrations tab, displays external integration management with MCP servers and APIs.

**Layout (100% screen width, 100% height)**:

- **Top Section (15% height)**: Integration overview and connection status
- **Main Grid (60% height)**: Integration cards and connection management
- **Bottom Section (25% height)**: Integration configuration and testing
- **Left Panel (20% width)**: Integration categories and types
- **Right Panel (80% width)**: Integration management and monitoring

**Components Needed**:

- **MCP Server Management**: Server configuration, connection status, performance monitoring
- **API Connection Interface**: API key management, rate limiting, usage monitoring
- **Webhook Configuration**: Webhook setup, security, delivery monitoring
- **External Service Authentication**: OAuth setup, API credentials, security tokens
- **Integration Status Monitoring**: Health checks, uptime monitoring, error reporting

**Sample Data**:

- **Connected Integrations**: Slack (Connected), QuickBooks (Connected), Google Workspace (Connected), Construction Software (Connected)
- **MCP Servers**: File System Server (Running), GitHub Server (Running), Notion Server (Stopped - Error)
- **API Status**: 15 active API connections, 98.7% uptime, 2.3 seconds average response time

### 27. Settings → System Tab

**Flow**: When clicking Settings tab → System tab, shows system configuration with backup, performance, and monitoring tools.

**Layout (100% screen width, 100% height)**:

- **Top Section (20% height)**: System health overview and status indicators
- **Main Area (60% height)**: Configuration forms and monitoring dashboard
- **Bottom Section (20% height)**: Maintenance tools and system logs
- **Left Panel (20% width)**: System categories and settings
- **Right Panel (80% width)**: System configuration and monitoring

**Components Needed**:

- **Backup & Recovery Tools**: Automated backup scheduling, recovery testing, backup verification
- **Performance Settings**: Resource allocation, caching configuration, optimization settings
- **Monitoring Configuration**: Alert thresholds, notification rules, escalation procedures
- **System Health Dashboard**: Real-time system metrics, resource usage, performance indicators
- **Maintenance Tools**: System updates, database optimization, log management

**Sample Data**:

- **System Health**: All systems operational, CPU usage 45%, Memory usage 62%, Storage 78% utilized
- **Backup Status**: Last backup 2 hours ago, next backup in 22 hours, backup retention 30 days
- **Performance Metrics**: Average response time 1.2 seconds, 99.8% uptime, 0 critical alerts

### 28. Settings → Tools Tab

**Flow**: When clicking Settings tab → Tools tab, displays tool marketplace and configuration management interface.

**Layout (100% screen width, 100% height)**:

- **Top Section (15% height)**: Tool overview and marketplace controls
- **Main Grid (60% height)**: Tool marketplace with categories and search
- **Bottom Section (25% height)**: Tool configuration and analytics
- **Left Panel (20% width)**: Tool categories and filters
- **Right Panel (80% width)**: Tool management and configuration

**Components Needed**:

- **Tool Marketplace**: Tool discovery, ratings, reviews, installation
- **Tool Configuration Interface**: Parameter setup, API configuration, usage limits
- **Tool Permission Management**: Role-based access, usage restrictions, audit logging
- **Usage Analytics**: Tool usage statistics, performance metrics, cost analysis
- **Custom Tool Development**: Tool creation interface, testing environment, deployment

**Sample Data**:

- **Available Tools**: Project Tracker (4.8/5 stars), Cost Calculator (4.6/5 stars), Safety Checklist (4.9/5 stars), Material Database (4.7/5 stars)
- **Installed Tools**: 12 tools installed, 8 tools active, 4 tools disabled
- **Tool Usage**: Project Tracker used 342 times, Cost Calculator used 156 times, Safety Checklist used 89 times this month

---

## 🎯 Usage Instructions

### For MagicPath.ai

1. **Reference Design System**: Always mention "Use specs/docs/DESIGN-SYSTEM.md for common elements"
2. **Copy Prompt**: Use the exact prompt format above
3. **Customize**: Adjust specific requirements as needed
4. **Test**: Generate and review the output

### For Developers

1. **Follow Design System**: Implement according to established patterns
2. **Component Reuse**: Use existing shadcn/ui components
3. **Responsive Design**: Ensure mobile-first approach
4. **Accessibility**: Follow WCAG guidelines

---

This document provides all 30 view-specific prompts for TeamHub, each focused on unique requirements while leveraging the comprehensive design system for consistency and efficiency.
