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

## Two-Stage Deployment Process

The deployment follows a smart two-stage approach that avoids duplicating services and only deploys what's needed:

### Stage 1: Infrastructure Setup

- **Checks existing infrastructure**: Verifies if PostgreSQL and Redis are already running and healthy
- **Conditional deployment**: Only deploys infrastructure if services are missing or unhealthy
- **Force redeploy option**: Can be overridden with `FORCE_REDEPLOY=true` to redeploy everything
- **Health verification**: Ensures databases are ready before proceeding

### Stage 2: Application Deployment

- **Full stack status check**: Verifies if teamhub and nginx services are already running
- **Smart updates**: Only deploys application stack if needed or when forced
- **Configuration management**: Properly handles nginx configuration and service networking
- **Health monitoring**: Performs post-deployment health checks

### 1. Build & Push (GitHub Actions)

- Builds Docker image from source code
- Pushes to GHCR with commit SHA tag and latest tag
- Uses Docker layer caching for efficiency
- Automatically cleans up old versions (keeps last 2)

### 2. Deploy (Self-hosted Server)

- Pulls latest image from GHCR
- Performs two-stage deployment as described above
- Runs comprehensive health checks
- Provides detailed deployment feedback

## Directory Structure

```
infrastructure/
├── configs/
│   ├── nginx.conf               # Nginx reverse proxy configuration
│   └── registry-config.yml      # Docker registry configuration
├── docker/
│   └── docker-stack.yml         # Docker Swarm stack definition
└── scripts/
    ├── deploy-application-enhanced.sh # Main enhanced deployment script
    ├── health-check.sh          # Post-deployment health verification
    ├── build-and-push.sh        # Build and push optimized images
    ├── compare-containers.sh    # Compare container variants
    ├── deploy-with-size-analysis.sh # Deployment with size analysis
    └── README.md                # Scripts documentation
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
✅ **Smart deployment**: Avoids duplicating existing healthy services
✅ **Health monitoring**: Comprehensive health checks after deployment

## Deployment Options

### Automatic Deployment (GitHub Actions)

The deployment runs automatically on pushes to main branch. You can also trigger manual deployments:

1. Go to Actions tab in GitHub
2. Select "Deploy to Self-Hosted Server"
3. Click "Run workflow"
4. Choose whether to force redeploy (optional)

### Manual Deployment

```bash
# Set environment variables
export PG_PASSWORD="your-pg-password"
export NEXTCLOUD_ADMIN_PASSWORD="your-nextcloud-password"
export NEXTCLOUD_DB_PASSWORD="your-nextcloud-db-password"
export CONTAINER_REGISTRY="ghcr.io/your-org/your-repo"

# Normal deployment (smart - only deploys what's needed)
./infrastructure/scripts/deploy-application-enhanced.sh <image-tag>
```

### Force Redeploy

Use this when you want to redeploy everything regardless of current state:

```bash
export FORCE_REDEPLOY="true"
./infrastructure/scripts/deploy-application-enhanced.sh <image-tag>
```

### Health Check

Run health checks independently:

```bash
./infrastructure/scripts/health-check.sh
```

## Smart Deployment Logic

The deployment script intelligently handles different scenarios:

| Scenario                          | Infrastructure Action          | Application Action               |
| --------------------------------- | ------------------------------ | -------------------------------- |
| Clean environment                 | Deploy infrastructure          | Deploy application               |
| Infrastructure exists + healthy   | Skip infrastructure            | Deploy application if needed     |
| Infrastructure exists + unhealthy | Redeploy infrastructure        | Deploy application               |
| Force redeploy = true             | Always redeploy infrastructure | Always redeploy application      |
| All services healthy              | Skip infrastructure            | Skip application (unless forced) |

## Cost Optimization

- **Auto-cleanup**: Keeps only last 2 Docker image versions
- **Layer caching**: Reduces build time and transfer costs
- **Alpine Linux**: Minimal base images for smaller size
- **Multi-stage builds**: Production images contain only necessary files
- **Smart deployment**: Avoids unnecessary redeployments

## Troubleshooting

### Common Issues

1. **GHCR Login Failed**

   - Verify GitHub Actions has proper permissions
   - Check if `GITHUB_TOKEN` has package write permissions

2. **Service Not Starting**

   - Check service logs: `docker service logs teamhub_<service-name>`
   - Verify environment variables are set
   - Run health check: `./infrastructure/scripts/health-check.sh`

3. **Database Connection Issues**

   - Ensure PostgreSQL service is running: `docker service ls`
   - Check database logs: `docker service logs teamhub_postgres`
   - Verify connection string in teamhub service

4. **Nginx Configuration Issues**
   - Check nginx logs: `docker service logs teamhub_nginx`
   - Verify nginx.conf syntax
   - Ensure all upstream services are available

### Health Checks

```bash
# Comprehensive health check
./infrastructure/scripts/health-check.sh

# Manual service checks
docker service ls
docker service logs teamhub_teamhub
docker service logs teamhub_nginx
docker service logs teamhub_postgres

# Test application endpoints
curl http://localhost/
curl http://localhost/nextcloud/
```

### Debugging Deployment Issues

1. **Check deployment logs** in GitHub Actions
2. **Review health check output** at the end of deployment
3. **Use force redeploy** if services are in inconsistent state:
   ```bash
   export FORCE_REDEPLOY_ALL="true"
   ./infrastructure/scripts/deploy-application-enhanced.sh <image-tag>
   ```
