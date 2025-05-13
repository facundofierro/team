# TeamHub Architecture & Deployment Guide

## High-Level Architecture

TeamHub is a multi-tenant AI agent management platform built with a modular, scalable architecture. Each organization operates in an isolated environment with its own database, agents, and settings.

### Main Components

- **Frontend/Backend:** Next.js (App Router)
- **UI:** shadcn/ui, Radix UI, Tailwind CSS
- **Database:** Postgres (one per organization, running on host Linux Ubuntu server)
- **ORM:** Drizzle ORM
- **Authentication:** next-auth
- **State Management:** Zustand
- **Deployment:** Vercel
- **Monitoring:** Sentry

## Data Flow & Multi-Tenancy

- Each organization is provisioned a dedicated Postgres database on the host system (Linux Ubuntu server).
- All agent data, insights, and settings are stored per-organization.
- API routes and server actions enforce organization isolation and security.
- Users can switch organizations via the UI; all queries and mutations are scoped to the selected organization.

## UI/UX

- All UI is built with [shadcn/ui](https://ui.shadcn.com/) components for accessibility and consistency.
- Sidebar navigation allows switching between organizations, agents, insights, and settings.
- Dialogs and forms use shadcn/ui primitives for a modern, responsive experience.

## Deployment

### Prerequisites

- Self-hosted server (with Docker and Docker Swarm configured)
- Postgres database(s) running on the host Linux Ubuntu server
- Required environment variables (see README)

### Steps

1. **Provision Postgres Database(s):**
   - Set up Postgres on your Linux Ubuntu server.
   - The app will automatically provision a new database for each organization.
2. **Build and Push Docker Image:**
   - Use the provided Dockerfile to build the app image.
   - Push the image to your Docker registry (e.g., Docker Hub). This is automated via GitHub Actions in `.github/workflows/deploy.yml`.
3. **Deploy with Docker Swarm:**
   - Use the `docker-stack.yml` file to deploy the stack to your self-hosted server.
   - Example: `docker stack deploy -c docker-stack.yml teamhub`
   - Ensure required environment variables (such as `PG_PASSWORD`) are set, either in the stack file or as secrets.
4. **Monitor & Scale:**
   - Use Sentry for error monitoring (configured in `next.config.mjs`).
   - Docker Swarm supports scaling for production workloads.

## Extensibility

- **Adding AI Models:**
  - Extend the AI provider integration layer to add new models.
- **Custom Tools:**
  - Add new tools via the tool integration framework; configure permissions per agent/organization.
- **UI Components:**
  - Build new features using shadcn/ui for consistency.

## Security

- Each organization's data is fully isolated at the database level.
- Environment variables and API tokens are encrypted and managed securely.
- All user actions are authenticated and scoped to their organization.

---

For further questions or advanced deployment scenarios, please open an issue or contact the maintainers.
