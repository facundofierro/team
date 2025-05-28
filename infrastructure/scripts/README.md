# Infrastructure Scripts

## Overview

This directory contains the deployment script for the TeamHub application using DockerHub as the container registry.

## Scripts

### `deploy-application.sh`

**Purpose**: Complete application deployment including infrastructure setup and application stack deployment.

**Usage**:

```bash
./deploy-application.sh <image-tag>
```

**Environment Variables Required**:

- `DOCKERHUB_USERNAME` - DockerHub username
- `PG_PASSWORD` - PostgreSQL password
- `NEXTCLOUD_ADMIN_PASSWORD` - Nextcloud admin password
- `NEXTCLOUD_DB_PASSWORD` - Nextcloud database password
- `FORCE_REDEPLOY` - (optional) Set to "true" to force redeploy infrastructure

**What it does**:

1. **Infrastructure Setup**: Creates PostgreSQL and Redis services if they don't exist
2. **Application Deployment**: Deploys the full application stack using DockerHub image
3. **Health Checks**: Waits for services to be ready and tests endpoints
4. **Cleanup**: Removes old containers

**Example**:

```bash
export DOCKERHUB_USERNAME="myusername"
export PG_PASSWORD="secure_password"
export NEXTCLOUD_ADMIN_PASSWORD="admin_password"
export NEXTCLOUD_DB_PASSWORD="db_password"

./deploy-application.sh abc123def456
```

## Deployment Flow

```
1. Check/Setup Infrastructure (PostgreSQL, Redis)
2. Pull DockerHub image: username/teamhub:tag
3. Deploy Docker Swarm stack
4. Wait for services to be ready
5. Perform health checks
6. Cleanup old containers
```

## Architecture Benefits

- **Simplified**: Single script handles everything
- **Reliable**: Uses DockerHub instead of private registry
- **Fast**: No tunnel setup or complex networking
- **Maintainable**: Standard Docker workflow

## Troubleshooting

### Common Issues

1. **Image Pull Failed**

   ```bash
   # Check DockerHub credentials
   docker login
   docker pull $DOCKERHUB_USERNAME/teamhub:latest
   ```

2. **Service Won't Start**

   ```bash
   # Check service status
   docker service ls
   docker service logs teamhub_<service-name>
   ```

3. **Database Connection Issues**
   ```bash
   # Check PostgreSQL
   docker service logs teamhub_postgres
   ```

### Manual Commands

```bash
# Check all services
docker service ls

# View service logs
docker service logs teamhub_teamhub --follow

# Remove all services (reset)
docker stack rm teamhub

# Force redeploy
export FORCE_REDEPLOY="true"
./deploy-application.sh <tag>
```

## Migration Notes

This simplified approach replaces the previous complex setup that included:

- ❌ Pinggy tunnel management
- ❌ Private Docker registry
- ❌ Complex nginx TLS configuration
- ❌ Multi-stage infrastructure deployment

The new approach is much more reliable and follows industry standards for Docker deployments.
