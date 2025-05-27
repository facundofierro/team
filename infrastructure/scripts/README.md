# Infrastructure Scripts

This directory contains modular scripts that handle different aspects of the deployment process. These scripts are part of the organized infrastructure directory structure and are used by the GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated deployments.

## Scripts Overview

### 🔧 `setup-pinggy.sh`

Handles Pinggy tunnel setup and management using systemd service.

**Usage:**

```bash
./setup-pinggy.sh {install|setup|check|restart|monitor|test|status}
```

**Commands:**

- `install` - Install Pinggy CLI and systemd service
- `setup` - Full setup (install + start systemd service)
- `check` - Check if service is running
- `restart` - Restart service if needed
- `monitor` - Monitor service stability for 30 seconds
- `test` - Test external access through tunnel
- `status` - Export tunnel status for GitHub Actions

**Note:** This script now uses the systemd service for better reliability and management.

### 🛠️ `manage-pinggy-service.sh`

Direct systemd service management for Pinggy tunnel.

**Usage:**

```bash
./manage-pinggy-service.sh {install|start|stop|restart|status|check|logs|follow|test|monitor|export-status|uninstall}
```

**Commands:**

- `install` - Install and enable Pinggy systemd service
- `start` - Start the Pinggy service
- `stop` - Stop the Pinggy service
- `restart` - Restart the Pinggy service
- `status` - Show detailed service status
- `check` - Quick check if service is running
- `logs` - Show recent service logs
- `follow` - Follow service logs in real-time
- `test` - Test external access through tunnel
- `monitor` - Monitor service stability for 30 seconds
- `export-status` - Export tunnel status for GitHub Actions
- `uninstall` - Remove the systemd service

### 🧪 `test-pinggy-service.sh`

Test script to verify Pinggy systemd service setup.

**Usage:**

```bash
./test-pinggy-service.sh
```

**Features:**

- Validates all required files and permissions
- Checks system dependencies
- Tests network connectivity
- Provides setup recommendations

### 🏗️ `deploy-infrastructure.sh`

Handles infrastructure deployment (nginx + Docker registry).

**Usage:**

```bash
export PG_PASSWORD="your_password"
./deploy-infrastructure.sh
```

**Features:**

- Checks if teamhub image exists in registry
- Checks if full stack is already deployed
- Only deploys infrastructure if needed
- Sets up registry volumes and authentication
- Waits for services to be ready

### 🚀 `deploy-application.sh`

Handles full application stack deployment.

**Usage:**

```bash
export PG_PASSWORD="your_password"
export NEXTCLOUD_ADMIN_PASSWORD="your_password"
export NEXTCLOUD_DB_PASSWORD="your_password"
./deploy-application.sh [IMAGE_TAG]
```

**Features:**

- Detects transition from infrastructure-only to full stack
- Updates docker-stack.yml with new image tag
- Handles both first deployment and updates
- Waits for services to be ready
- Tests application endpoints
- Cleans up old containers

### 🔍 `test-connectivity.sh`

Tests connectivity to the Docker registry through Pinggy tunnel.

**Usage:**

```bash
export REGISTRY_DOMAIN="r1.teamxagents.com"
./test-connectivity.sh
```

**Features:**

- Tests DNS resolution
- Tests basic connectivity (HTTPS/HTTP)
- Tests registry endpoint specifically
- Tests registry authentication
- Determines best protocol and exports to GitHub environment

## Environment Variables

### Required for all scripts:

- `PG_PASSWORD` - PostgreSQL password

### Required for application deployment:

- `NEXTCLOUD_ADMIN_PASSWORD` - Nextcloud admin password
- `NEXTCLOUD_DB_PASSWORD` - Nextcloud database password

### Optional:

- `REGISTRY_DOMAIN` - Registry domain (defaults to `r1.teamxagents.com`)
- `REGISTRY_PROTOCOL` - Protocol to use (set by test-connectivity.sh)

## GitHub Actions Integration

The scripts are designed to work seamlessly with GitHub Actions:

1. **setup-registry job**: Uses `setup-pinggy.sh` and `deploy-infrastructure.sh`
2. **build-and-push job**: Uses `test-connectivity.sh`
3. **deploy job**: Uses `deploy-application.sh`

## Benefits of Modular Structure

1. **Maintainability**: Each script has a single responsibility
2. **Reusability**: Scripts can be used independently or in other workflows
3. **Testability**: Individual components can be tested separately
4. **Readability**: Main workflow file is much cleaner and easier to understand
5. **Debugging**: Easier to isolate and fix issues in specific components

## Local Development

You can run these scripts locally for testing:

```bash
# Test Pinggy setup
./infrastructure/scripts/setup-pinggy.sh check

# Test infrastructure deployment
export PG_PASSWORD="test"
./infrastructure/scripts/deploy-infrastructure.sh

# Test connectivity
./infrastructure/scripts/test-connectivity.sh
```

## Error Handling

All scripts use `set -e` to exit on any error and include proper error messages and logging for debugging purposes.
