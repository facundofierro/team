# Infrastructure Documentation

## Overview

This infrastructure uses a simplified Docker Swarm deployment with GitHub Container Registry (GHCR) for storing Docker images. The architecture eliminates the complexity of private registries and external services for maximum reliability and cost efficiency.

## Architecture

```
GitHub Actions → GitHub Container Registry → Self-hosted Server (Docker Swarm)
```

### Components

1. **GitHub Container Registry (GHCR)**: Container registry for storing Docker images
2. **Docker Swarm**: Container orchestration on self-hosted server
3. **PostgreSQL**: Primary database
4. **Redis**: Caching and session storage
5. **Nginx**: Reverse proxy and web server
6. **Teamhub**: Main application
7. **Nextcloud**: File storage and collaboration

## Deployment Process

### 1. Build & Push (GitHub Actions)

- Builds Docker image from source code
- Pushes to GHCR with commit SHA tag and latest tag
- Uses Docker layer caching for efficiency
- Automatically cleans up old versions (keeps last 2)

### 2. Deploy (Self-hosted Server)

- Pulls latest image from GHCR
- Sets up infrastructure (databases) if needed
- Deploys full application stack
- Performs health checks

## Directory Structure

```
infrastructure/
├── configs/
│   └── nginx.conf          # Simplified nginx configuration
├── docker/
│   └── docker-stack.yml    # Docker Swarm stack definition
└── scripts/
    ├── deploy-application.sh    # Main deployment script
    ├── test-pinggy-fix.sh      # Legacy Pinggy script
    ├── check-pinggy-domain.sh  # Legacy Pinggy script
    └── README.md               # Scripts documentation
```

## Environment Variables

Required secrets in GitHub Actions:

- `PG_PASSWORD` - PostgreSQL password
- `NEXTCLOUD_ADMIN_PASSWORD` - Nextcloud admin password
- `NEXTCLOUD_DB_PASSWORD` - Nextcloud database password
- `SUDO` - Server sudo password

**Note**: `GITHUB_TOKEN` is automatically provided by GitHub Actions for GHCR access.

## Benefits of This Architecture

✅ **Cost-effective**: Free tier covers most projects (500MB-50GB storage)
✅ **Integrated**: Native GitHub integration with automatic cleanup
✅ **Reliable**: GitHub's enterprise-grade infrastructure
✅ **Secure**: Uses GitHub tokens with proper scoping
✅ **Simple**: No external service dependencies
✅ **Fast**: Optimized with Docker layer caching

## Deployment Commands

### Manual Deployment

```bash
# Set environment variables
export PG_PASSWORD="your-pg-password"
export NEXTCLOUD_ADMIN_PASSWORD="your-nextcloud-password"
export NEXTCLOUD_DB_PASSWORD="your-nextcloud-db-password"
export CONTAINER_REGISTRY="ghcr.io/your-org/your-repo"

# Deploy
./infrastructure/scripts/deploy-application.sh <image-tag>
```

### Force Redeploy

```bash
export FORCE_REDEPLOY="true"
./infrastructure/scripts/deploy-application.sh <image-tag>
```

## Cost Optimization

- **Auto-cleanup**: Keeps only last 2 Docker image versions
- **Layer caching**: Reduces build time and transfer costs
- **Alpine Linux**: Minimal base images for smaller size
- **Multi-stage builds**: Production images contain only necessary files

## Troubleshooting

### Common Issues

1. **GHCR Login Failed**

   - Verify GitHub Actions has proper permissions
   - Check if `GITHUB_TOKEN` has package write permissions

2. **Service Not Starting**

   - Check service logs: `docker service logs teamhub_<service-name>`
   - Verify environment variables are set

3. **Database Connection Issues**
   - Ensure PostgreSQL service is running: `docker service ls`
   - Check database logs: `docker service logs teamhub_postgres`

### Health Checks

```bash
# Check all services
docker service ls

# Check specific service
docker service logs teamhub_teamhub

# Test application
curl http://localhost/health
```

## Legacy Scripts

The `scripts/` directory contains some legacy Pinggy-related scripts that may be useful for specific deployment scenarios but are not part of the main workflow:

- `test-pinggy-fix.sh` - Pinggy service testing
- `check-pinggy-domain.sh` - Pinggy domain checking

These are maintained for reference but not used in the current GitHub Container Registry workflow.
