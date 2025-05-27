# Infrastructure

This directory contains all infrastructure-related files for the TeamHub deployment. The structure is organized to separate concerns and make the project more maintainable.

## Directory Structure

```
infrastructure/
├── scripts/           # Deployment and management scripts
├── configs/           # Configuration files (nginx, etc.)
├── docker/           # Docker-related files (compose, setup scripts)
└── README.md         # This file
```

## 📁 Directory Contents

### `/scripts`

Contains modular deployment and management scripts:

- **`setup-pinggy.sh`** - Pinggy tunnel management
- **`deploy-infrastructure.sh`** - Infrastructure deployment (nginx + registry)
- **`deploy-application.sh`** - Full application stack deployment
- **`test-connectivity.sh`** - Connectivity testing for CI/CD
- **`README.md`** - Detailed script documentation

### `/configs`

Contains configuration files:

- **`nginx.conf`** - Full nginx configuration for production
- **`nginx-infra.conf`** - Infrastructure-only nginx configuration

### `/docker`

Contains Docker-related files:

- **`docker-stack.yml`** - Docker Swarm stack definition
- **`setup-registry.sh`** - Docker registry setup script

## 🚀 Quick Start

### Local Development

```bash
# Test Pinggy setup
./infrastructure/scripts/setup-pinggy.sh check

# Test infrastructure deployment
export PG_PASSWORD="your_password"
./infrastructure/scripts/deploy-infrastructure.sh

# Test connectivity
./infrastructure/scripts/test-connectivity.sh
```

### Production Deployment

The GitHub Actions workflow automatically uses these scripts:

1. **Setup Phase**: `setup-pinggy.sh` + `deploy-infrastructure.sh`
2. **Build Phase**: `test-connectivity.sh`
3. **Deploy Phase**: `deploy-application.sh`

## 🔧 Configuration

### Environment Variables

```bash
# Required for all deployments
export PG_PASSWORD="your_postgres_password"

# Required for full application deployment
export NEXTCLOUD_ADMIN_PASSWORD="your_nextcloud_admin_password"
export NEXTCLOUD_DB_PASSWORD="your_nextcloud_db_password"

# Optional
export REGISTRY_DOMAIN="r1.teamxagents.com"
```

### Script Usage

Each script supports multiple commands. See individual script help:

```bash
./infrastructure/scripts/setup-pinggy.sh --help
./infrastructure/scripts/deploy-infrastructure.sh --help
./infrastructure/scripts/deploy-application.sh --help
```

## 🏗️ Architecture

### Infrastructure Components

1. **Pinggy Tunnel** - Exposes local services to the internet
2. **Nginx Reverse Proxy** - Routes traffic and handles SSL
3. **Docker Registry** - Stores application images
4. **PostgreSQL** - Application database
5. **Nextcloud** - File sharing and collaboration
6. **TeamHub Application** - Main application

### Deployment Flow

```
GitHub Actions → Pinggy Tunnel → Nginx → Docker Services
```

## 📋 Maintenance

### Monitoring

```bash
# Check tunnel status
./infrastructure/scripts/setup-pinggy.sh check

# Monitor services
docker service ls
docker service logs teamhub_nginx
docker service logs teamhub_registry
```

### Troubleshooting

```bash
# Restart tunnel
./infrastructure/scripts/setup-pinggy.sh restart

# Check connectivity
./infrastructure/scripts/test-connectivity.sh

# View logs
tail -f /tmp/pinggy.log
docker service logs teamhub_nginx --follow
```

## 🔄 Updates

### Adding New Services

1. Update `docker/docker-stack.yml`
2. Modify `configs/nginx.conf` if needed
3. Update deployment scripts if necessary

### Configuration Changes

1. Modify files in `configs/`
2. Test locally
3. Deploy via GitHub Actions

## 🛡️ Security

- All secrets are managed via GitHub Secrets
- Registry authentication is enforced
- Nginx handles SSL termination
- Services communicate via internal Docker networks

## 📚 Documentation

- [Scripts Documentation](scripts/README.md)
- [Docker Stack Configuration](docker/docker-stack.yml)
- [Nginx Configuration](configs/)

## 🤝 Contributing

When adding infrastructure changes:

1. Keep scripts modular and focused
2. Update documentation
3. Test locally before committing
4. Follow the established directory structure
5. Use proper error handling (`set -e`)

## 🔗 Related

- [Main Project README](../README.md)
- [Application Documentation](../apps/)
- [GitHub Actions Workflow](../.github/workflows/deploy.yml)
