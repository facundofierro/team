# 🤖 Agents Section UI Specifications

The Agents section provides comprehensive management of AI agents with 4 focused tabs:

1. **Chat Tab** (4) - Live conversations and interactions with agents
2. **Configuration Tab** (5) - System prompt, basic settings, and tool assignment
3. **Memory Tab** (7) - Conversation history, memory management, and knowledge base
4. **Analytics & Monitoring Tab** (8) - Analytics dashboard, automatic instance management, and performance monitoring

---

## 4. Agents → Chat Tab

**Flow**: When clicking Agents tab → Chat tab, loads agent chat interface with left panel showing available agents and right panel showing chat conversation.

**Layout (Tab Content Area)**:

- **Chat Interface (100% width)**: Chat interface with message history and input
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

---

## 5. Agents → Configuration Tab

**Flow**: When clicking Agents tab → Configuration tab, shows agent configuration interface focused on system prompt and basic settings.

**Layout (Tab Content Area)**:

- **Top Section (15% height)**: Agent header with name, description, status, and save button
- **Main Area (80% height)**: System prompt editor and tool assignment
- **Bottom Section (5% height)**: Action buttons (Save, Reset)

**Components Needed**:

- **System Prompt Editor**: Rich text editor with AI assistance, prompt templates, character count, and validation
- **Basic Agent Settings**: Name, description, role/type, status (Active/Inactive)
- **Tool Assignment**: Simple list of available tools with checkboxes for assignment
- **Prompt Templates**: Pre-built templates for common agent types (Customer Service, Project Manager, Data Analyst, etc.)
- **AI Writing Assistant**: Help optimize and improve system prompts
- **Security Configuration Panel**: Role-based access control, permissions, and audit settings

**Core Configuration Fields**:

#### 1. Agent Identity

- **Name**: Agent display name
- **Description**: Brief description of agent's purpose
- **Role/Type**: Basic categorization (Customer Service, Project Manager, Data Analyst, etc.)
- **Status**: Active/Inactive toggle

#### 2. System Prompt (Main Focus)

- **Primary Instructions**: Core system prompt defining agent behavior, knowledge, and capabilities
- **Role Definition**: What the agent is and what it does
- **Behavior Guidelines**: How the agent should respond and interact
- **Knowledge Base**: What information the agent has access to
- **Response Style**: Tone, format, and communication preferences
- **Instance Customization**: Support for instance-specific prompt variations (e.g., customer-specific context)

#### 3. Tool Access

- **Available Tools**: List of tools this agent can use
- **Tool Assignment**: Checkbox selection of which tools to enable
- **Tool Configuration**: Basic settings for assigned tools (if needed)

#### 4. Security & Access Control

- **User Role Permissions**: Define which user roles can interact with this agent
- **Chat Access Control**: Control who can start conversations with this agent
- **Configuration Access**: Restrict who can modify agent settings and prompts
- **Tool Usage Permissions**: Control which users can trigger specific tools
- **Data Access Restrictions**: Limit what data the agent can access based on user permissions
- **Audit Logging**: Track all configuration changes and access attempts

**Sample Data**:

- **System Prompts**:

  - **Customer Service Agent**: "You are a helpful customer service representative for [Company Name]. You help customers with product questions, order status, returns, and general support. Always be polite, professional, and solution-oriented. Use available tools to look up order information and process requests."
  - **Project Manager**: "You are an experienced project manager with expertise in construction and development projects. You help teams plan, track, and execute projects. You can create project plans, track progress, manage budgets, and coordinate team activities. Always provide clear, actionable guidance."
  - **Data Analyst**: "You are a skilled data analyst who helps organizations understand their data and make informed decisions. You can analyze data, create reports, identify trends, and provide insights. Present information clearly and suggest actionable recommendations."

- **Available Tools**: File Processor, Email Sender, Database Query, Google Search, Memory Search, Agent Discovery, MCP Connector, Web Browser (when enabled)

- **Tool Assignment Example**: Customer Service Agent → [✓] File Processor, [✓] Email Sender, [✓] Memory Search, [✓] Database Query

- **Security Configuration Examples**:

  - **Customer Service Agent**:

    - **Chat Access**: All authenticated users
    - **Configuration Access**: Admin, Customer Service Manager roles only
    - **Tool Permissions**:
      - File Processor: Customer Service team only
      - Email Sender: Customer Service team only
      - Database Query: Customer Service team only
    - **Data Access**: Customer data only (no financial or internal data)

  - **Project Manager Agent**:

    - **Chat Access**: Project team members, Project Managers, Executives
    - **Configuration Access**: Admin, Project Manager roles only
    - **Tool Permissions**:
      - Project Tracker: Project team members only
      - Cost Calculator: Project Managers, Executives only
      - Communication Hub: All project stakeholders
    - **Data Access**: Project-specific data only (no cross-project access)

  - **Financial Analyst Agent**:
    - **Chat Access**: Finance team, Executives only
    - **Configuration Access**: Admin, CFO, Finance Manager roles only
    - **Tool Permissions**:
      - Database Query: Finance team only
      - Report Generator: Finance team, Executives only
      - Cost Calculator: Finance team, Project Managers only
    - **Data Access**: Financial data only (restricted access to sensitive information)

---

## 6. Agents → Performance Tab

**Flow**: When clicking Agents tab → Performance tab, displays comprehensive performance analytics, results tracking, and optimization recommendations.

**Layout (Tab Content Area)**:

- **Top Section (20% height)**: Performance overview cards (Cost, Response Time, Success Rate, User Satisfaction)
- **Middle Section (55% height)**: Detailed analytics charts, results metrics, and performance data
- **Bottom Section (25% height)**: Optimization suggestions, action items, and execution logs

**Tab Structure**:

The Agents section has 4 focused tabs:

1. **Chat Tab** (4) - Live conversations and interactions with agents
2. **Configuration Tab** (5) - System prompt, basic settings, and tool assignment
3. **Memory Tab** (7) - Conversation history, memory management, and knowledge base
4. **Instances Tab** (8) - Instance management, filtering, and organization

**Core Performance Metrics (Priority 1)**:

#### 1. Cost & Resource Usage

- **LLM Usage by Provider**: OpenAI, DeepSeek, Fal, Eden AI breakdown
- **Token Consumption**: Input/output tokens per conversation
- **Cost per Interaction**: Real-time cost tracking
- **Monthly Cost Trends**: Cost optimization opportunities
- **Provider Performance**: Cost vs. quality comparison

#### 2. Execution Performance

- **Response Time**: Average, 95th percentile, max response times
- **Success Rate**: % of successful executions vs. failures
- **Error Types**: Categorization of common failures
- **Tool Usage Patterns**: Which tools are used most/least
- **Execution Logs**: Detailed logs for debugging specific interactions

#### 3. Business Impact Metrics

- **User Satisfaction**: Ratings, feedback scores
- **Task Completion Rate**: % of tasks completed successfully
- **Time Savings**: Estimated time saved vs. manual processes
- **ROI Metrics**: Cost savings vs. implementation costs

**Results & Outputs Metrics (Priority 2)**:

#### 4. Content Creation & Knowledge Generation

- **Memories Created**: Number of new memories stored per agent
- **Memory Quality Score**: Relevance and usefulness ratings
- **Documents Generated**: Reports, summaries, analysis documents
- **Content Types**: Text, structured data, visualizations, code
- **Content Reuse Rate**: How often created content is referenced

#### 5. Task Completion & Deliverables

- **Tasks Completed**: Successfully finished tasks vs. attempted
- **Deliverable Types**: Emails sent, reports generated, data processed
- **Task Complexity**: Simple vs. complex task completion rates
- **Time to Completion**: How long tasks take from start to finish
- **User Approval Rate**: % of outputs that users accept/modify

#### 6. Tool Execution Results

- **Tools Used Successfully**: Successful vs. failed tool executions
- **Data Processed**: Records processed, files analyzed, APIs called
- **External System Interactions**: Database updates, API calls, file operations
- **Tool Efficiency**: Which tools produce best results for different tasks
- **Integration Success Rate**: % of successful external system connections

**Advanced Analytics (Priority 3)**:

#### 7. Usage Patterns & Quality Assessment

- **Peak Usage Times**: When agents are most/least active
- **User Engagement**: Conversation length, return usage
- **Feature Adoption**: Which agent capabilities are used most
- **Accuracy Validation**: Human review scores of agent outputs
- **Output Quality**: Completeness, relevance, consistency metrics

#### 8. Operational Health & Real-Time Monitoring

- **Uptime & Availability**: Agent accessibility metrics
- **Concurrent Users**: Load handling capabilities
- **Memory Usage**: Database and storage consumption
- **API Rate Limits**: Provider quota utilization
- **Live Activity Feed**: Current agent conversations
- **Performance Alerts**: Notifications for performance degradation

**Interactive Features**:

#### 9. Drill-Down Capabilities

- **Individual Execution View**: Click any metric to see detailed logs
- **Conversation Replay**: Step-through specific agent interactions
- **Tool Execution Details**: See exactly what tools were called and when
- **Error Investigation**: Detailed error logs with context
- **Execution Logs**: Searchable, filterable log of all agent activities

**Components Needed**:

- **Performance Metrics Dashboard**: Key metrics with trend indicators and benchmarks
- **Cost Analysis Panel**: LLM provider breakdown, monthly trends, cost alerts
- **Results Tracking**: Content creation, task completion, tool effectiveness
- **Usage Analytics Charts**: Line charts showing agent usage over time, response time distribution
- **Quality Assessment**: Accuracy scores, user satisfaction ratings, error analysis
- **Real-Time Monitoring**: Live performance data and alerts
- **Execution Logs**: Comprehensive log viewer with search and filtering
- **Performance Optimization**: AI-powered suggestions for improving agent performance

**Sample Data**:

- **Performance Metrics**: Average Response Time (2.3s), Success Rate (94%), Cost per Interaction ($0.15), User Satisfaction (4.2/5)
- **Results Metrics**: Memories Created (47), Documents Generated (12), Tasks Completed (89%), Time Saved (23 hours)
- **Cost Analysis**: Monthly Cost ($450), LLM Breakdown (OpenAI 60%, DeepSeek 25%, Fal 15%), Cost Trend (-15% this month)
- **Tool Usage**: Most Used (File Processor 45%, Email Sender 30%, Database Query 25%), Success Rate (98%)
- **Optimization Suggestions**: "Consider adding more safety protocols to Safety Officer agent", "Project Manager agent could benefit from additional cost analysis tools", "File Processor tool usage suggests high document processing demand"

---

## 7. Agents → Memory Tab

**Flow**: When clicking Agents tab → Memory tab, displays conversation history, memory management, and knowledge base for the selected agent.

**Layout (Tab Content Area)**:

- **Top Section (20% height)**: Memory overview and search interface
- **Middle Section (60% height)**: Memory list and conversation history
- **Bottom Section (20% height)**: Memory details and management

**Components Needed**:

- **Memory Search**: Search through agent memories and conversations
- **Memory List**: Chronological list of stored memories with importance scores
- **Conversation History**: Complete chat history with context preservation
- **Memory Management**: Edit, delete, and organize memories
- **Knowledge Base**: Facts, preferences, and learned information
- **Memory Analytics**: Usage patterns and memory effectiveness

**Core Features**:

#### 1. Memory Overview

- **Total Memories**: Count of stored memories
- **Memory Types**: Conversation, fact, preference, skill breakdown
- **Recent Activity**: Latest memory creation and access
- **Search Interface**: Quick search across all memories

#### 2. Memory List & History

- **Chronological Order**: Most recent memories first
- **Memory Categories**: Conversation, fact, preference, skill
- **Importance Scores**: 1-10 scale for memory relevance
- **Access Patterns**: How often memories are retrieved
- **Context Tags**: Categorization and tagging system

#### 3. Memory Management

- **Memory Editing**: Modify stored memories and facts
- **Memory Deletion**: Remove outdated or incorrect information
- **Memory Organization**: Group related memories together
- **Memory Export**: Export memories for backup or analysis
- **Memory Import**: Import memories from external sources

**Sample Data**:

- **Memory Types**:

  - **Conversation Memory**: "Customer inquiry about shipping costs to Argentina - provided detailed breakdown including customs, taxes, and delivery times"
  - **Fact Memory**: "Standard shipping time to Argentina: 15-25 business days via sea freight, 3-5 days via air freight"
  - **Preference Memory**: "Customer prefers email communication over phone calls"
  - **Skill Memory**: "Successfully processed 47 import documentation requests this month"

- **Memory Analytics**:
  - **Total Memories**: 156 stored memories
  - **Memory Types**: Conversations (89), Facts (45), Preferences (12), Skills (10)
  - **Most Accessed**: Shipping costs (23 times), Customs procedures (18 times)
  - **Memory Quality**: Average importance score 7.2/10

---

## 8. Agents → Instances Tab

**Flow**: When clicking Agents tab → Instances tab, displays instance management interface for viewing, filtering, and analyzing multiple instances of the selected agent.

**Layout (Tab Content Area)**:

- **Top Section (20% height)**: Instance overview, filters, and search controls
- **Middle Section (60% height)**: Instance list/grid with filtering and tagging
- **Bottom Section (20% height)**: Instance details and bulk actions

**Components Needed**:

- **Instance Overview Cards**: Total instances, instances by state, recent activity
- **Filter & Search Panel**: Tag-based filtering, state filtering, date ranges, search
- **Instance List/Grid**: View of instances with tags, states, and key metrics
- **Tag Management**: Add/remove tags, tag statistics, tag-based grouping
- **State Management**: View instances by state (Active, Completed, Pending, etc.)
- **Instance Details**: Quick view of individual instance information
- **Bulk Actions**: Select multiple instances for bulk operations

**Core Features**:

#### 1. Instance Overview & Statistics

- **Instance Counts**: Total instances, instances by state, instances by tag
- **Recent Activity**: New instances created, state changes, tag updates
- **Quick Filters**: Most common tags, most common states, recent time periods

#### 2. Tag-Based Filtering & Organization

- **Tag Filtering**: Select tags to show only instances with those tags
- **Tag Statistics**: Count of instances per tag, tag combinations
- **Tag Management**: Add new tags, remove tags, edit tag names
- **Tag Grouping**: Group instances by tag combinations

#### 3. Instance State Management

- **State Categories**: Active, Completed, Pending, Archived, Error
- **State Filtering**: View instances by current state
- **State Transitions**: See how instances move between states
- **State Statistics**: Count of instances in each state

#### 4. Instance List & Grid Views

- **List View**: Table format with columns for instance ID, state, tags, created date, last activity
- **Grid View**: Card format showing instance summary with visual state indicators
- **Sorting Options**: Sort by date, state, tags, activity level
- **Pagination**: Handle large numbers of instances

#### 5. Instance Details & Quick Actions

- **Instance Summary**: Key information about each instance
- **Quick Actions**: View details, change state, add/remove tags
- **Bulk Selection**: Select multiple instances for bulk operations
- **Export Options**: Export filtered instances to CSV/JSON

**Use Case Examples**:

#### Public Website Agent (Multiple Customer Interactions)

- **Instances**: Each customer interaction creates an instance
- **Tags**: "Product Interest", "Ready to Buy", "Technical Question", "High Priority"
- **States**: Active, Completed, Escalated, Archived
- **Analytics**: How many instances are "Ready to Buy", how many need escalation

#### Research Agent (Multiple Research Projects)

- **Instances**: Each research assignment creates an instance
- **Tags**: "Market Analysis", "Competitor Research", "Trend Analysis", "Complete"
- **States**: In Progress, Review, Complete, Archived
- **Analytics**: How many research projects are complete, how many are in progress

#### Customer Support Agent (Multiple Support Tickets)

- **Instances**: Each support request creates an instance
- **Tags**: "Technical Issue", "Billing Question", "Feature Request", "Resolved"
- **States**: Open, In Progress, Waiting for Customer, Resolved, Closed
- **Analytics**: How many tickets are open, how many are resolved

**Components Needed**:

- **Instance Overview Cards**: Total instances, instances by state, instances by tag
- **Filter Panel**: Tag checkboxes, state dropdowns, date range picker, search input
- **Instance Table/Grid**: Sortable columns, pagination, bulk selection
- **Tag Management Panel**: Add/remove tags, tag statistics, tag filtering
- **State Management Panel**: State filters, state transition view
- **Instance Detail Modal**: Quick view of instance information
- **Bulk Actions Toolbar**: Actions for selected instances
- **Export Controls**: Export filtered instances

**Sample Data**:

- **Instance Overview**: Total Instances (156), Active (23), Completed (89), Pending (44)
- **Tag Statistics**: "Product Interest" (67), "Ready to Buy" (23), "Technical Issue" (34), "High Priority" (12)
- **State Distribution**: Active (23), Completed (89), Pending (44), Archived (0)
- **Recent Activity**: 12 new instances today, 8 state changes, 15 tag updates

**Configuration Requirements**:

#### 1. Instance Display Configuration

- **Columns to Show**: Instance ID, State, Tags, Created Date, Last Activity, Actions
- **Default Sort**: Sort by creation date (newest first)
- **Items per Page**: 25, 50, 100 instances per page
- **View Options**: List view, grid view, compact view

#### 2. Filter & Search Configuration

- **Default Filters**: Show all instances, or default to specific state/tag
- **Search Fields**: Search by instance ID, tags, or conversation content
- **Date Ranges**: Today, Last 7 days, Last 30 days, Custom range
- **Tag Display**: Show all tags, or limit to most common tags

#### 3. Tag Management Configuration

- **Tag Creation**: Allow users to create new tags
- **Tag Editing**: Allow users to edit tag names
- **Tag Deletion**: Allow users to delete unused tags
- **Tag Colors**: Assign colors to different tag categories
