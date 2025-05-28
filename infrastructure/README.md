# Infrastructure Documentation

## Overview

This infrastructure uses a simplified Docker Swarm deployment with DockerHub as the container registry. The architecture eliminates the complexity of private registries and tunnels for maximum reliability.

## Architecture

```
GitHub Actions → DockerHub → Self-hosted Server (Docker Swarm)
```

### Components

1. **DockerHub**: Container registry for storing Docker images
2. **Docker Swarm**: Container orchestration on self-hosted server
3. **PostgreSQL**: Primary database
4. **Redis**: Caching and session storage
5. **Nginx**: Reverse proxy and web server
6. **Teamhub**: Main application
7. **Nextcloud**: File storage and collaboration

## Deployment Process

### 1. Build & Push (GitHub Actions)

- Builds Docker image from source code
- Pushes to DockerHub with commit SHA tag
- No complex registry setup required

### 2. Deploy (Self-hosted Server)

- Pulls latest image from DockerHub
- Sets up infrastructure (databases) if needed
- Deploys full application stack
- Performs health checks

## Configuration Files

- `docker/docker-stack.yml` - Main Docker Swarm stack definition
- `configs/nginx.conf` - Nginx configuration
- `scripts/deploy-application.sh` - Main deployment script

## Environment Variables

Required secrets in GitHub Actions:

- `DOCKERHUB_USERNAME` - DockerHub username
- `DOCKERHUB_TOKEN` - DockerHub access token
- `PG_PASSWORD` - PostgreSQL password
- `NEXTCLOUD_ADMIN_PASSWORD` - Nextcloud admin password
- `NEXTCLOUD_DB_PASSWORD` - Nextcloud database password
- `SUDO` - Server sudo password

## Benefits of This Architecture

✅ **Reliable**: DockerHub provides 99.9% uptime
✅ **Simple**: Standard Docker workflow without tunnels
✅ **Fast**: No tunnel bottlenecks or connectivity issues
✅ **Secure**: DockerHub handles TLS/SSL properly
✅ **Maintainable**: Industry-standard approach

## Deployment Commands

### Manual Deployment

```bash
# Set environment variables
export DOCKERHUB_USERNAME="your-username"
export PG_PASSWORD="your-pg-password"
export NEXTCLOUD_ADMIN_PASSWORD="your-nextcloud-password"
export NEXTCLOUD_DB_PASSWORD="your-nextcloud-db-password"

# Deploy
./infrastructure/scripts/deploy-application.sh <image-tag>
```

### Force Redeploy

```bash
export FORCE_REDEPLOY="true"
./infrastructure/scripts/deploy-application.sh <image-tag>
```

## Troubleshooting

### Common Issues

1. **DockerHub Login Failed**

   - Verify `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets
   - Ensure token has write permissions

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

## Migration from Private Registry

If migrating from the previous private registry setup:

1. Remove any existing Pinggy services
2. Clean up old registry containers
3. Update GitHub secrets with DockerHub credentials
4. Trigger new deployment

The new system will automatically handle infrastructure setup and application deployment in a single, reliable process.
