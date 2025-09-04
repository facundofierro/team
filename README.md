# Agelum – Enterprise AI Agent Management Platform

<div align="center">

**A modern, multi-tenant platform for creating, managing, and orchestrating AI agents at scale**

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-ready-blue?style=flat&logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

[🚀 Live Demo](https://r1.teamxagents.com) • [📚 Documentation](./docs/) • [🐛 Report Bug](https://github.com/your-repo/issues) • [💡 Request Feature](https://github.com/your-repo/issues)

</div>

---

## 🌟 Overview

TeamHub is an enterprise-grade platform that revolutionizes how organizations create, deploy, and manage AI agents. Built for multi-tenant environments, it provides isolated workspaces where teams can leverage artificial intelligence through custom agents tailored to their specific organizational needs.

### ✨ Key Highlights

- **🏢 Multi-Organization Architecture**: Secure, isolated environments for each organization
- **🤖 Advanced AI Agent System**: Create intelligent agents with custom roles, tools, and workflows
- **🧠 Sophisticated Memory Management**: Persistent memory with smart retrieval and context management
- **🔧 Extensible Tool System**: Built-in integrations and custom tool development framework
- **💬 Real-Time Communication**: Agent-to-agent communication and workflow orchestration
- **📊 Analytics & Insights**: Comprehensive dashboards and performance monitoring
- **🔐 Enterprise Security**: Role-based access control and data isolation
- **🚀 Production Ready**: Docker Swarm deployment with CI/CD automation

---

## 🏗️ Architecture

TeamHub follows a modern microservices architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                          TeamHub Platform                       │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js 14)                                         │
│  ├── shadcn/ui Components    ├── Zustand State Management      │
│  ├── Real-time Chat          ├── Agent Management              │
│  └── Analytics Dashboard     └── Organization Settings         │
├─────────────────────────────────────────────────────────────────┤
│  Backend Services                                              │
│  ├── AI Gateway              ├── TeamHub Core                  │
│  ├── Browser Service         └── Database Layer                │
├─────────────────────────────────────────────────────────────────┤
│  Data & Infrastructure                                         │
│  ├── PostgreSQL + pgvector   ├── Redis Cache                   │
│  ├── Nextcloud Storage       └── Docker Swarm                  │
└─────────────────────────────────────────────────────────────────┘
```

### 🏢 Applications

| Application         | Purpose                               | Technology           |
| ------------------- | ------------------------------------- | -------------------- |
| **teamhub**         | Main web application with UI and API  | Next.js 14, React 18 |
| **ai-gateway**      | Unified AI provider abstraction layer | Next.js API routes   |
| **browser-service** | Automated browser control service     | Playwright, Node.js  |

### 📦 Packages

| Package         | Purpose                               | Features                         |
| --------------- | ------------------------------------- | -------------------------------- |
| **teamhub-ai**  | AI functions and tool integrations    | Chat, workflows, tool management |
| **agelum-db**   | Database schemas and ORM functions    | Drizzle ORM, type-safe queries   |
| **ai-services** | Multi-provider AI service abstraction | OpenAI, DeepSeek, Fal, Eden AI   |

---

## 🚀 Features

### 🏢 **Multi-Organization Management**

- **Isolated Environments**: Each organization operates with complete data isolation
- **Dynamic Organization Switching**: Seamless context switching in the UI
- **Per-Organization Database**: Dedicated database namespaces for security
- **Custom Branding**: Organization-specific theming and configuration

### 🤖 **Advanced AI Agent System**

- **Hierarchical Agent Structure**: Parent-child relationships with inheritance
- **Agent Cloning & Instances**: Multiple instances with separate contexts
- **Custom System Prompts**: Fine-grained control over agent behavior
- **Role-Based Configuration**: Specialized agents for different use cases
- **State Management**: Persistent agent state across sessions

### 🧠 **Intelligent Memory Management**

- **Conversation Memory**: Automatic conversation history with context retrieval
- **Semantic Search**: Vector-based memory search using pgvector
- **Memory Categories**: Organized storage (facts, preferences, skills, context)
- **Retention Policies**: Configurable memory lifecycle management
- **Cross-Agent Memory Sharing**: Shared organizational knowledge

### 🛠️ **Comprehensive Tool Ecosystem**

- **Built-in Search Tools**: Google, DuckDuckGo, Yandex integration
- **Agent Communication**: Agent-to-agent messaging and workflow coordination
- **Memory Tools**: Advanced memory search and management
- **Web Automation**: Browser control and automation capabilities
- **Custom Tool Framework**: Extensible tool development system
- **Usage Controls**: Fine-grained permissions and rate limiting

### 💬 **Real-Time Communication**

- **Streaming Chat**: WebSocket-based real-time messaging
- **Message Types**: Support for chat, tasks, workflows, notifications
- **Scheduled Messages**: Cron-based message scheduling
- **Priority Handling**: Message prioritization and routing
- **Context Preservation**: Conversation context across sessions

### 📊 **Analytics & Insights**

- **Performance Dashboards**: Agent and organization metrics
- **Usage Analytics**: Tool usage and interaction statistics
- **Data Exploration**: Interactive data grids and visualizations
- **Health Monitoring**: System health and error tracking
- **Custom Reports**: Configurable reporting system

### 🔒 **Enterprise Security**

- **Multi-Provider Authentication**: Yandex, Google, credentials, test users
- **Organization Isolation**: Complete data separation
- **Role-Based Access Control**: Granular permission management
- **API Security**: Secure server-to-server communication
- **Audit Logging**: Comprehensive activity tracking

---

## 🛠️ Technology Stack

### **Frontend & Backend**

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.0
- **UI Library**: shadcn/ui, Radix UI, Tailwind CSS
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Real-time**: Vercel AI SDK for streaming

### **Database & Storage**

- **Primary Database**: PostgreSQL 15 with pgvector extension
- **ORM**: Drizzle ORM with type-safe queries
- **Caching**: Redis for session and application caching
- **File Storage**: Nextcloud integration
- **Migrations**: Drizzle migrations with automated deployment

### **AI & Machine Learning**

- **AI Providers**: OpenAI, DeepSeek, Fal, Eden AI
- **Vector Search**: pgvector for semantic memory search
- **Text Processing**: Advanced embedding generation
- **Streaming**: Real-time AI response streaming
- **Tool Integration**: Extensible tool framework

### **Deployment & Infrastructure**

- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Swarm with automated deployment
- **CI/CD**: GitHub Actions with selective redeployment
- **Registry**: GitHub Container Registry (GHCR)
- **Optimization**: Distroless containers, 90% size reduction
- **Monitoring**: Health checks and service monitoring

### **Additional Services**

- **Reverse Proxy**: Nginx with custom routing
- **Video Processing**: Remotion service
- **Testing**: Playwright for E2E testing
- **Error Tracking**: PostHog integration
- **Performance**: Optimized build pipeline with Turbo

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and pnpm 8+
- **PostgreSQL** 15+ (or Docker for local development)
- **Redis** 7+ (or Docker for local development)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd teamhub

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp apps/teamhub/.env.example apps/teamhub/.env.local
```

### Environment Configuration

Create `apps/teamhub/.env.local` with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://teamhub:password@localhost:5432/teamhub"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# AI Providers (choose one or more)
DEEPSEEK_API_KEY="your-deepseek-key"
OPENAI_API_KEY="your-openai-key"

# Search Tools (optional)
GOOGLE_API_KEY="your-google-key"
GOOGLE_CX="your-custom-search-engine-id"
YANDEX_API_KEY="your-yandex-key"
YANDEX_USER_KEY="your-yandex-user-key"

# Authentication Providers
YANDEX_CLIENT_ID="your-yandex-client-id"
YANDEX_CLIENT_SECRET="your-yandex-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Access Control
ALLOWED_EMAILS="admin@example.com,user@example.com"

# Development (optional)
ENABLE_TEST_USER="true"
TEST_USER_EMAIL="test@example.com"
TEST_USER_PASSWORD="testpassword"
```

### Development

```bash
# Start all services in development mode
pnpm dev

# Or start specific services
pnpm dev:teamhub        # Main application
pnpm build:ai-gateway   # AI Gateway only
```

### Production Deployment

```bash
# Build for production
pnpm build:teamhub:prod

# Docker deployment (automated CI/CD)
./infrastructure/scripts/deploy.sh v1.0.0

# Health check
./infrastructure/scripts/health-check.sh
```

---

## 📖 Usage Guide

### 1. **Creating Your First Organization**

1. Sign in to TeamHub using your configured authentication provider
2. Click "Create Organization" in the sidebar
3. Enter your organization name
4. Your organization will be created with its own isolated environment

### 2. **Setting Up AI Agents**

1. Navigate to the "Agents" section
2. Click "Add new agent"
3. Configure your agent:
   - **Name**: Give your agent a descriptive name
   - **Role**: Define the agent's primary function
   - **System Prompt**: Set the agent's behavior and personality
   - **Tools**: Enable search and other tools as needed
   - **Memory Rules**: Configure memory storage and retrieval

### 3. **Agent Communication**

**Chat with Agents:**

```typescript
// Agents support streaming responses and memory context
const response = await sendChat({
  databaseName: organization.databaseName,
  text: 'Hello, how can you help me?',
  agentId: 'agent-123',
  memoryRules: [
    /* memory configuration */
  ],
})
```

**Agent-to-Agent Communication:**

```typescript
// Agents can communicate with each other
await agentToAgent({
  targetAgentId: 'agent-456',
  messageType: 'task',
  content: 'Please analyze this data and report findings',
  priority: 'high',
})
```

### 4. **Tool Management**

Navigate to "Settings" → "Tools" to:

- Configure available tools for your organization
- Set usage limits and time restrictions
- Assign tools to specific agents
- Monitor tool usage and costs

### 5. **Memory & Context Management**

Agents automatically store and retrieve relevant memories:

- **Conversations**: Chat history with semantic search
- **Facts**: Important information learned during interactions
- **Preferences**: User preferences and organizational context
- **Skills**: Agent capabilities and learned behaviors

---

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev                    # Start all apps in development
pnpm dev:teamhub           # Start TeamHub only

# Building
pnpm build                 # Build all apps
pnpm build:teamhub         # Build TeamHub for production
pnpm build:teamhub:prod    # Build with production environment

# Testing
pnpm test                  # Run all tests
pnpm test:e2e              # Run E2E tests
pnpm test:e2e:ui           # Run E2E tests with UI
pnpm playwright:install    # Install Playwright browsers

# Database
pnpm db:generate           # Generate database schemas
pnpm db:push              # Push schema changes

# Code Quality
pnpm prettier-fix         # Format code
pnpm clean                # Clean build artifacts
```

### Project Structure

```
teamhub/
├── apps/
│   ├── teamhub/          # Main Next.js application
│   ├── ai-gateway/       # AI provider abstraction service
│   └── browser-service/  # Automated browser control
├── packages/
│   ├── teamhub-ai/       # AI functions and tools
│   ├── agelum-db/       # Database schemas and functions
│   └── ai-services/      # Multi-provider AI abstractions
├── infrastructure/
│   ├── docker/           # Docker configurations
│   └── scripts/          # Deployment and utility scripts
├── docs/                 # Documentation
└── tests/               # End-to-end tests
```

### Adding Custom Tools

Create a new tool in `packages/teamhub-ai/src/tools/`:

```typescript
import { ToolTypeDefinition } from '../tools'
import { z } from 'zod'

export const myCustomTool: ToolTypeDefinition = {
  id: 'myCustomTool',
  type: 'myCustomTool',
  description: 'Description of what this tool does',
  parametersSchema: z.object({
    input: z.string().describe('Input parameter'),
  }),
  handler: async (params, configuration) => {
    // Tool implementation
    return { success: true, result: 'Tool output' }
  },
}
```

### Extending AI Providers

Add new AI providers in `packages/ai-services/src/`:

1. Create provider implementation in `generate/newprovider.ts`
2. Add discovery logic in `discover/newprovider.ts`
3. Update the main `generate.ts` and `discover.ts` files
4. Register provider in the gateway routing

---

## 🚢 Deployment

### Docker Swarm (Recommended)

TeamHub uses an advanced Docker Swarm deployment with:

```bash
# Automated deployment with selective service updates
FORCE_REDEPLOY_TEAMHUB=true ./infrastructure/scripts/deploy.sh v1.0.0

# Full deployment
FORCE_REDEPLOY_ALL=true ./infrastructure/scripts/deploy.sh v1.0.0
```

**Features:**

- ✅ Selective service redeployment
- ✅ Automatic pgvector extension installation
- ✅ Zero-downtime deployments
- ✅ Container optimization (90% size reduction)
- ✅ Health monitoring and rollback

### GitHub Actions CI/CD

The project includes automated CI/CD with:

- Automated building and testing
- Multi-stage Docker builds
- GitHub Container Registry integration
- Selective deployment triggers
- Health checks and monitoring

### Environment Variables for Production

Set these as GitHub Secrets or environment variables:

```bash
# Required
PG_PASSWORD=your-postgres-password
NEXTCLOUD_ADMIN_PASSWORD=your-nextcloud-password
NEXTCLOUD_DB_PASSWORD=your-nextcloud-db-password

# Optional
CONTAINER_REGISTRY=ghcr.io/your-username
VERBOSE_DEPLOY=true
```

---

## 📊 Performance & Monitoring

### Optimization Features

- **Container Size**: 90% reduction using distroless images
- **Database**: pgvector for efficient vector operations
- **Caching**: Redis for session and application caching
- **CDN**: Optimized static asset delivery
- **Streaming**: Real-time AI response streaming

### Monitoring

- **Health Checks**: Automated service health monitoring
- **Error Tracking**: PostHog integration for error monitoring
- **Performance**: Real-time performance metrics
- **Usage Analytics**: Tool usage and interaction tracking

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes and commit**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use shadcn/ui components for consistency
- Write tests for new features
- Update documentation
- Follow the existing code style

### Code Style

The project uses:

- **Prettier** for code formatting
- **ESLint** for code quality
- **TypeScript** for type safety
- **Conventional Commits** for commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./docs/license.md) file for details.

---

## 🆘 Support & Documentation

- **📚 Full Documentation**: [./docs/](./docs/)
- **🏗️ Architecture Guide**: [./docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **🚀 Deployment Guide**: [./docs/enhanced-deployment.md](./docs/enhanced-deployment.md)
- **🐛 Issue Tracker**: [GitHub Issues](https://github.com/your-repo/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

---

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful UI components
- **Vercel** for the AI SDK and deployment platform
- **Next.js** team for the fantastic framework
- **Drizzle** for the type-safe ORM
- **All contributors** who help make this project better

---

<div align="center">

**Made with ❤️ by the TeamHub team**

[⭐ Star on GitHub](https://github.com/your-repo) • [🐦 Follow on Twitter](https://twitter.com/your-handle)

</div>
