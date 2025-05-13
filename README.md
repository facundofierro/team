# TeamHub – Multi-Organization AI Agent Platform

## Overview

TeamHub is a modern platform for creating and managing organizations, each with its own set of AI agents. Designed for multi-tenant environments, TeamHub enables organizations to securely manage their own agents, data, and workflows, all within a beautiful, accessible UI built with [shadcn/ui](https://ui.shadcn.com/) components.

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
  - (Any other variables required by your authentication/provider setup)

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
