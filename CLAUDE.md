# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Commands

### Development

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start all apps in development mode
pnpm dev:agelum           # Start only Agelum (main app)
```

### Building

```bash
pnpm build                # Build all apps
pnpm build:agelum         # Build Agelum for production
pnpm build:agelum:prod    # Build with production environment
pnpm build:ai-gateway     # Build AI Gateway only
```

### Testing

```bash
pnpm test                 # Run all tests
pnpm test:e2e             # Run E2E tests
pnpm test:e2e:ui          # Run E2E tests with UI
pnpm playwright:install   # Install Playwright browsers
```

### Database Operations

```bash
pnpm db:generate          # Generate database schemas
pnpm db:push              # Push schema changes to database
```

### Code Quality

```bash
pnpm prettier-fix         # Format code with Prettier
pnpm clean               # Clean build artifacts
```

## Architecture Overview

Agelum is a multi-tenant AI agent management platform built with a microservices architecture:

### Core Applications

- **agelum**: Main Next.js 14 application with UI and API
- **ai-gateway**: AI provider abstraction layer (OpenAI, DeepSeek, etc.)
- **browser-service**: Automated browser control using Playwright

### Shared Packages

- **@agelum/ai**: AI functions and tool integrations
- **@agelum/db**: Database schemas and ORM functions (Drizzle ORM)
- **@agelum/ai-services**: Multi-provider AI service abstraction
- **@drizzle/reactive**: Reactive database client with real-time updates
- **@repo/logger**: Centralized logging utilities
- **@repo/ux-core**: Shared UI components and design system

### Infrastructure

- **Database**: PostgreSQL 15 with pgvector extension
- **Cache**: Redis for sessions and caching
- **Deployment**: Docker Swarm with GitHub Container Registry
- **File Storage**: Nextcloud integration
- **Reverse Proxy**: Nginx with custom routing

## Project Structure

```
agelum/
├── apps/
│   ├── agelum/           # Main Next.js application (Port 3000)
│   ├── ai-gateway/       # AI provider gateway (Next.js API routes)
│   └── browser-service/  # Browser automation service (Express + Playwright)
├── packages/
│   ├── agelum-ai/        # AI functions and tools
│   ├── agelum-db/        # Database schemas, migrations, and ORM
│   ├── ai-services/      # AI provider integrations
│   ├── drizzle-reactive/ # Reactive database client
│   ├── logger/          # Logging utilities
│   └── ux-core/         # Shared UI components
├── infrastructure/
│   ├── docker/          # Docker configurations and stack files
│   ├── scripts/         # Deployment and utility scripts
│   └── configs/         # Nginx and service configurations
├── specs/
│   ├── docs/           # Architecture and design documentation
│   └── tasks/          # Development task tracking
└── docs/               # User documentation
```

## Key Development Areas

### Multi-Tenant Architecture

- Each organization has isolated data within shared PostgreSQL
- Organization context determined from URL/database name
- All queries scoped to current organization via middleware

### AI Agent System

- Agents are configured with roles, system prompts, and tools
- Memory management with semantic search using pgvector
- Agent-to-agent communication via message passing
- Real-time streaming responses using Vercel AI SDK

### Tool Framework

- Extensible tool system in `packages/agelum-ai/src/tools/`
- Built-in tools: search (Google, DuckDuckGo, Yandex), memory search, web browser
- MCP (Model Context Protocol) integration for external tools
- Tool usage tracking and rate limiting

### Database Design

- Drizzle ORM with type-safe queries
- Organization-scoped tables with tenant isolation
- Vector embeddings for semantic memory search
- Reactive updates via Server-Sent Events

## Environment Setup

### Required Environment Variables (apps/agelum/.env.local)

```bash
# Database
DATABASE_URL="postgresql://agelum:password@localhost:5432/agelum"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Providers
DEEPSEEK_API_KEY="your-key"
OPENAI_API_KEY="your-key"

# Search Tools
GOOGLE_API_KEY="your-key"
GOOGLE_CX="your-search-engine-id"
YANDEX_API_KEY="your-key"

# Auth Providers
YANDEX_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_ID="your-client-id"
```

### Docker Development

```bash
# Start infrastructure services
docker-compose -f infrastructure/docker/docker-stack.yml up -d

# Deploy full stack
./infrastructure/scripts/deploy.sh v1.0.0

# Force redeploy specific services
FORCE_REDEPLOY_AGELUM=true ./infrastructure/scripts/deploy.sh v1.0.0
```

## Code Conventions

### TypeScript

- Strict mode enabled across all packages
- Type-safe database queries with Drizzle
- Zod schemas for runtime validation

### UI Components

- shadcn/ui components for consistency
- Tailwind CSS for styling
- Custom components in `@repo/ux-core`

### File Naming

- Use kebab-case for files and directories
- Component files use PascalCase (e.g., `AgentDetail.tsx`)
- API routes use kebab-case (e.g., `api/generate/route.ts`)

### State Management

- Zustand for global state (agents, organizations)
- React Query for server state
- Local state with React hooks for component state

## Key Files to Know

### Entry Points

- `apps/agelum/src/app/page.tsx` - Main dashboard
- `apps/agelum/src/app/agents/page.tsx` - Agent management
- `apps/agelum/src/app/api/chat/route.ts` - AI chat endpoint

### Core Components

- `apps/agelum/src/components/agents/AgentsList.tsx` - Agent list UI
- `apps/agelum/src/components/agents/agentDetails/ChatCard.tsx` - Agent chat interface
- `packages/agelum-ai/src/functions/sendChat.ts` - Core chat functionality

### Database Schema

- `packages/agelum-db/src/schema.ts` - Main database schema
- `packages/agelum-db/src/db/memory/schema.ts` - Memory storage schema
- `packages/agelum-db/src/db/embeddings/schema.ts` - Vector embeddings

### Configuration

- `turbo.json` - TurboRepo configuration
- `pnpm-workspace.yaml` - Workspace packages
- `next.config.mjs` - Next.js configuration for each app

## Deployment Commands

### Local Development

```bash
# Start all services
pnpm dev

# Start specific service
pnpm dev:agelum
```

### Production Deployment

```bash
# Build for production
pnpm build:agelum:prod

# Deploy to Docker Swarm
./infrastructure/scripts/deploy.sh v1.0.0

# Health check
./infrastructure/scripts/health-check.sh
```

### GitHub Actions

Deployment is automated via GitHub Actions:

- Builds optimized Docker images
- Pushes to GitHub Container Registry
- Deploys to self-hosted Docker Swarm
- Runs health checks and monitoring
