# Agelum

A powerful platform for creating and managing organizations with AI agents. Agelum enables teams to leverage artificial intelligence through custom agents tailored to their specific organizational needs.

## 🌟 Features

### 🏢 Organization Management

- **Multi-Organization Support**: Create and manage multiple organizations within a single platform
- **Organization Switching**: Seamlessly switch between different organizations
- **Isolated Environments**: Each organization has its own agents, settings, and data

### 🤖 AI Agent System

- **Custom AI Agents**: Create intelligent agents with specific roles and capabilities
- **Hierarchical Structure**: Build agent hierarchies with parent-child relationships
- **Agent Cloning**: Support for agent instances and cloning capabilities
- **Memory Management**: Advanced memory rules and retention policies
- **System Prompts**: Customize agent behavior with tailored system prompts

### 💬 Chat & Communication

- **Real-time Chat**: Stream-based communication with AI agents
- **Memory Integration**: Agents remember previous conversations and context
- **Multi-Provider Support**: Support for multiple AI providers (DeepSeek, OpenAI)
- **Message Types**: Support for different message types (chat, tasks, info)

### 🛠️ Tool Integration

- **Built-in Tools**: Integrated search tools (Google, DuckDuckGo, Yandex)
- **Tool Management**: Configure and manage tool permissions per agent
- **Custom Tools**: Extensible tool system for custom integrations
- **Usage Controls**: Set usage limits and time restrictions for tools

### 📊 Insights & Analytics

- **Organization Insights**: View analytics and insights for your organizations
- **Agent Performance**: Track agent interactions and performance
- **Data Visualization**: Visual representation of organization data

### ⚙️ Advanced Features

- **Workflow Management**: Send complex workflows and task sequences to agents
- **Cron Scheduling**: Schedule recurring tasks and automated workflows
- **Policy Definitions**: Define rules and policies for agent behavior
- **Settings Management**: Comprehensive organization and agent settings

## 🏗️ Architecture

Agelum is built as a modern monorepo with the following structure:

```
├── apps/
│   └── teamhub/          # Main Next.js application
├── packages/
│   ├── teamhub-ai/       # AI functions and tools
│   └── agelum-db/       # Database schemas and functions
```

### Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: Radix UI, shadcn/ui, Tailwind CSS
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Vercel AI SDK
- **Deployment**: Docker support with multiple configurations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL database

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd team
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in `apps/teamhub/` with:

   ```env
   # Database
   DATABASE_URL=postgresql://...

   # Authentication
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000

   # AI Providers
   DEEPSEEK_API_KEY=your-deepseek-key
   OPENAI_API_KEY=your-openai-key

   # Search Tools (Optional)
   GOOGLE_API_KEY=your-google-key
   GOOGLE_CX=your-custom-search-engine-id
   YANDEX_API_KEY=your-yandex-key
   YANDEX_USER_KEY=your-yandex-user-key
   ```

4. **Start the development server**

   ```bash
   pnpm dev:teamhub
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### Creating Your First Organization

1. Sign in to Agelum
2. Click "Create Organization" in the sidebar
3. Enter your organization name
4. Your organization will be created with its own isolated environment

### Setting Up AI Agents

1. Navigate to the "Agents" section
2. Click "Add new agent"
3. Configure your agent:
   - **Name**: Give your agent a descriptive name
   - **Role**: Define the agent's primary role
   - **System Prompt**: Set the agent's behavior and personality
   - **Tools**: Enable search and other tools as needed
   - **Memory Rules**: Configure how the agent should store and retrieve information

### Chatting with Agents

1. Select an agent from the agents list
2. Use the chat interface to communicate
3. Agents will remember context and previous conversations
4. Use different message types for various interactions

### Setting Up Authentication

#### For Production (Yandex OAuth)

1. Create a Yandex OAuth application
2. Set `YANDEX_CLIENT_ID` and `YANDEX_CLIENT_SECRET`
3. Add allowed emails to `ALLOWED_EMAILS`

#### For Testing (Google OAuth)

1. Create a Google OAuth application in Google Cloud Console
2. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. Add your test emails to `ALLOWED_EMAILS`

#### For Development (Email/Password)

1. Set `ENABLE_CREDENTIALS_AUTH=true`
2. Set test credentials: `TEST_USER_EMAIL` and `TEST_USER_PASSWORD`
3. Add the test email to `ALLOWED_EMAILS`

#### For Automated Testing (Test User)

1. Set `ENABLE_TEST_USER=true`
2. Set `TEST_USER_EMAIL` (this will allow instant login)
3. Add the test email to `ALLOWED_EMAILS`

### Managing Tools

1. Go to "Settings" → "Tools"
2. Configure available tools for your organization
3. Set usage limits and time restrictions
4. Assign tools to specific agents

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev:agelum          # Start Agelum in development mode
pnpm dev                  # Start all apps in development mode

# Building
pnpm build:agelum        # Build Agelum for production
pnpm build:agelum:prod   # Build with production environment
pnpm build                # Build all apps

# Starting
pnpm start:agelum        # Start Agelum in production mode
pnpm start                # Start all apps in production mode

# Utilities
pnpm lint                 # Run linting
pnpm prettier-fix         # Format code
pnpm clean                # Clean build artifacts
```

### Project Structure

```
apps/teamhub/src/
├── app/                  # Next.js App Router pages
│   ├── agents/          # Agent management pages
│   ├── dashboard/       # Dashboard pages
│   ├── insights/        # Analytics pages
│   ├── settings/        # Settings pages
│   └── api/            # API routes
├── components/          # React components
│   ├── agents/         # Agent-related components
│   ├── layout/         # Layout components
│   ├── settings/       # Settings components
│   └── ui/            # UI components (shadcn/ui)
├── stores/             # Zustand state stores
├── lib/               # Utility libraries
└── utils/             # Helper functions
```

## 🔌 API Reference

### Core Functions

The `@teamhub/ai` package provides several key functions:

#### `sendChat(params)`

Send a chat message to an AI agent with streaming response.

#### `sendTask(params)`

Create and send a task to an agent with optional cron scheduling.

#### `sendWorkflow(params)`

Send multiple tasks as a workflow to an agent.

#### `sendInfo(params)`

Send informational content to an agent.

#### `getToolTypes()`

Retrieve all available tool types in the system.

See the [AI package documentation](../../packages/teamhub-ai/README.md) for detailed API reference.

## 🐳 Docker Deployment

Agelum includes multiple Docker configurations:

- `Dockerfile`: Standard Docker build
- `Dockerfile.distroless`: Minimal distroless image
- `Dockerfile.optimized`: Performance-optimized build

```bash
# Build the Docker image
docker build -t teamhub -f Dockerfile .

# Run the container
docker run -p 3000:3000 teamhub
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## 🆘 Support

For support and questions:

- Check the documentation in this README
- Review the [AI package documentation](../../packages/teamhub-ai/README.md)
- Open an issue in the repository

---

Built with ❤️ for intelligent team collaboration
