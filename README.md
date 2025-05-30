# TeamHub – Multi-Organization AI Agent Platform

## Overview

TeamHub agents is a modern platform for creating and managing organizations, each with its own set of AI agents. Designed for multi-tenant environments, TeamHub enables organizations to securely manage their own agents, data, and workflows, all within a beautiful, accessible UI built with [shadcn/ui](https://ui.shadcn.com/) components.

## Features

- **Multi-Organization Support**

  - Create and switch between organizations
  - Each organization has isolated data, settings, and agents
  - Secure, dedicated database per organization

- **AI Agent Management**

  - Create, view, and configure AI agents for each organization
  - Agents have customizable roles, memory, tools, and policies
  - Agent-to-agent communication and workflow automation

- **Insights & Analytics**

  - View organization-specific insights, logs, and analytics
  - Data grid and table views for easy exploration

- **Organization Settings**

  - Manage organization-wide settings, tool integrations, and users
  - Configure available tools and permissions for agents

- **Modern UI/UX**

  - Built with shadcn/ui components for a consistent, accessible experience
  - Responsive design with sidebar navigation and dialogs

- **Extensible Architecture**
  - Add new AI models and tools easily
  - Modular codebase for rapid feature development

## Technical Stack

- **Frontend & Backend:** Next.js (App Router)
- **UI Components:** shadcn/ui, Radix UI
- **Database:** Neon (Postgres)
- **ORM:** Drizzle ORM
- **Authentication:** next-auth
- **State Management:** Zustand
- **Deployment:** Vercel
- **Other:** Tailwind CSS, Sentry, React Query

---

👉 For detailed architecture and deployment information, see [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Available Routes

The application is deployed at **r1.teamxagents.com** using nginx with pinggy. Below are the available routes:

### Frontend Routes

| Route        | Description                                                        | Authentication Required |
| ------------ | ------------------------------------------------------------------ | ----------------------- |
| `/`          | Home page (redirects to dashboard after login)                     | ✅                      |
| `/agents`    | Agent management interface - create, view, and configure AI agents | ✅                      |
| `/dashboard` | Main dashboard view                                                | ✅                      |
| `/insights`  | Data insights and analytics with table views                       | ✅                      |
| `/settings`  | Organization and application settings                              | ✅                      |

### API Routes

| Route                     | Method   | Description                          | Authentication Required |
| ------------------------- | -------- | ------------------------------------ | ----------------------- |
| `/api/auth/signin`        | GET      | Sign in page                         | ❌                      |
| `/api/auth/signout`       | POST     | Sign out endpoint                    | ❌                      |
| `/api/auth/[...nextauth]` | GET/POST | NextAuth.js authentication endpoints | ❌                      |
| `/api/chat`               | POST     | Send messages to AI agents           | ✅                      |

### Additional Services (via Nginx Proxy)

| Route         | Service   | Description                                          | Authentication Required |
| ------------- | --------- | ---------------------------------------------------- | ----------------------- |
| `/nextcloud/` | Nextcloud | File storage, collaboration, and document management | ✅ (Nextcloud login)    |
| `/remotion/`  | Remotion  | Video rendering and generation service               | ✅                      |
| `/health`     | Nginx     | Health check endpoint for monitoring                 | ❌                      |

### Service Architecture

The nginx reverse proxy routes requests to different backend services:

- **TeamHub App** (`teamhub:3000`) - Main Next.js application
- **Nextcloud** (`nextcloud:80`) - File storage and collaboration platform
- **Remotion** (`remotion:3001`) - Video rendering service
- **PostgreSQL** - Database for TeamHub and Nextcloud (internal)
- **Redis** - Cache layer for TeamHub (internal)

### Route Parameters

Most routes accept query parameters for organization-scoped functionality:

- **`organizationId`** (required) - Identifies the active organization
- **`id`** (optional) - For selecting specific agents or data items
- **`tab`** (optional) - For tab-based navigation within pages
- **`tableId`** (optional) - For selecting specific data tables in insights

### Example URLs

```
# Main TeamHub Application
https://r1.teamxagents.com/
https://r1.teamxagents.com/agents?organizationId=org-123
https://r1.teamxagents.com/agents?organizationId=org-123&id=agent-456&tab=config
https://r1.teamxagents.com/insights?organizationId=org-123&tableId=1
https://r1.teamxagents.com/settings?organizationId=org-123

# Additional Services
https://r1.teamxagents.com/nextcloud/          # Nextcloud file storage
https://r1.teamxagents.com/remotion/           # Remotion video rendering
https://r1.teamxagents.com/health              # Health check endpoint
```

### Authentication Flow

1. All routes except `/api/auth/*` require authentication
2. Unauthenticated users are automatically redirected to `/api/auth/signin`
3. After successful authentication, users are redirected to the requested page
4. Session management is handled by NextAuth.js with secure cookies

---

## Getting Started

### Prerequisites

- Node.js
- Postgres database (Neon or your own Postgres server)
- Required environment variables:
  - `PG_HOST`: Hostname of your Postgres server
  - `PG_USER`: Username for your Postgres server
  - `PG_PASSWORD`: Password for your Postgres server
  - `NEXTAUTH_URL`: The canonical URL of your deployment (e.g. https://yourdomain.com)
  - `NEXTAUTH_SECRET`: Secret for NextAuth session encryption
  - `SENTRY_DSN`: Sentry Data Source Name for error monitoring
  - TODO: (Any other variables required by your authentication/provider setup)

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd teamhub
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure your environment variables** with your Postgres, NextAuth, and Sentry credentials

### Development

```bash
npm run dev
```

## User Flow

1. **Sign in and create an organization**
2. **Switch between organizations** using the sidebar
3. **Create and manage AI agents** within each organization
4. **Configure agent roles, memory, tools, and policies**
5. **View insights and analytics** for your organization
6. **Manage organization settings, users, and integrations**

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## License

[License Type] – See LICENSE file for details

## Support

For support, please [contact information or link to issues]
