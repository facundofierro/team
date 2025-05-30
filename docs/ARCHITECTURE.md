# TeamHub Architecture & Deployment Guide

## High-Level Architecture

TeamHub is a multi-tenant AI agent management platform built with a modular, scalable architecture. Each organization operates in an isolated environment with its own database, agents, and settings.

### Main Components

- **Frontend/Backend:** Next.js (App Router)
- **UI:** shadcn/ui, Radix UI, Tailwind CSS
- **Database:** PostgreSQL (Docker Swarm service)
- **Cache:** Redis (Docker Swarm service)
- **ORM:** Drizzle ORM
- **Authentication:** next-auth
- **State Management:** Zustand
- **Deployment:** Self-hosted Docker Swarm with GitHub Container Registry
- **File Storage:** Nextcloud integration
- **Monitoring:** Health checks and service monitoring

## Current Infrastructure

The deployment uses a simplified, modern stack:

```
GitHub Actions → GitHub Container Registry → Self-hosted Docker Swarm
```

### Service Architecture

- **TeamHub Application**: Next.js app with optimized containers
- **PostgreSQL**: Primary database for application data
- **Redis**: Caching and session storage
- **Nginx**: Reverse proxy and load balancer
- **Nextcloud**: File sharing and collaboration
- **Remotion**: Video rendering service

## Data Flow & Multi-Tenancy

- Each organization is provisioned with isolated data within the shared PostgreSQL database
- All agent data, insights, and settings are stored per-organization
- API routes and server actions enforce organization isolation and security
- Users can switch organizations via the UI; all queries and mutations are scoped to the selected organization

## UI/UX

- All UI is built with [shadcn/ui](https://ui.shadcn.com/) components for accessibility and consistency
- Sidebar navigation allows switching between organizations, agents, insights, and settings
- Dialogs and forms use shadcn/ui primitives for a modern, responsive experience

## Deployment

### Prerequisites

- Self-hosted server with Docker and Docker Swarm configured
- GitHub Container Registry access
- Required environment variables and secrets

### Current Deployment Process

1. **Automated CI/CD**:

   - GitHub Actions builds optimized Docker images
   - Images are pushed to GitHub Container Registry (GHCR)
   - Automated deployment to self-hosted Docker Swarm

2. **Enhanced Deployment Features**:

   - Selective service redeployment (nginx, teamhub, remotion, infrastructure, nextcloud)
   - Data volume safety checks
   - Automatic nginx configuration management
   - Health monitoring and post-deployment verification

3. **Container Optimization**:
   - Next.js standalone output for minimal containers
   - Distroless base images for security
   - 90% size reduction compared to traditional builds

### Environment Variables

Set these as GitHub Secrets:

- `PG_PASSWORD`: PostgreSQL password
- `NEXTCLOUD_ADMIN_PASSWORD`: Nextcloud admin password
- `NEXTCLOUD_DB_PASSWORD`: Nextcloud database password
- `SUDO`: Server sudo password

### Deployment Commands

```bash
# Enhanced deployment with selective redeployment
FORCE_REDEPLOY_TEAMHUB=true ./infrastructure/scripts/deploy-application-enhanced.sh v1.0.0

# Full deployment
FORCE_REDEPLOY_ALL=true ./infrastructure/scripts/deploy-application-enhanced.sh v1.0.0

# Health checks
./infrastructure/scripts/health-check.sh
```

## Extensibility

- **Adding AI Models**: Extend the AI provider integration layer
- **Custom Tools**: Add new tools via the tool integration framework
- **UI Components**: Build new features using shadcn/ui for consistency
- **New Services**: Use the enhanced deployment system for additional services

## Security

- Each organization's data is isolated at the application level
- Environment variables and secrets are managed securely through GitHub
- Optimized containers with minimal attack surface
- All user actions are authenticated and scoped to their organization

## Monitoring & Scaling

- Health check scripts for service monitoring
- Docker Swarm supports horizontal scaling
- Automated deployment with rollback capabilities
- Volume preservation for data safety

---

For deployment guides and advanced configuration, see:

- [enhanced-deployment.md](./enhanced-deployment.md) - Selective redeployment options
- [container-optimization.md](./container-optimization.md) - Container optimization guide
- [../infrastructure/scripts/README.md](../infrastructure/scripts/README.md) - Deployment scripts documentation
