# Enhanced Deployment System

## Overview

The enhanced deployment system provides granular control over service redeployment, allowing you to selectively redeploy individual services while preserving data and minimizing downtime.

## Key Features

### 🎯 Granular Service Control

- **Nginx**: Reverse proxy and load balancer
- **TeamHub**: Main application service
- **Remotion**: Video rendering service
- **Infrastructure**: PostgreSQL and Redis databases
- **Nextcloud**: File sharing and collaboration platform

### 🛡️ Data Safety

- **Automatic volume detection**: Checks for existing data volumes
- **Data preservation**: Volumes are preserved during service redeployment
- **Size reporting**: Shows current volume sizes for monitoring

### 🔄 Smart Deployment Logic

- **Selective updates**: Only redeploys services that need updates or are explicitly forced
- **Dependency awareness**: Handles service dependencies correctly
- **Health monitoring**: Waits for services to be healthy before proceeding

## Usage

### GitHub Actions Workflow

When triggering a manual deployment, you can now select specific services to redeploy:

```yaml
# Available options in GitHub Actions:
force_redeploy_all: false # Redeploy all services
force_redeploy_nginx: false # Redeploy only Nginx
force_redeploy_teamhub: false # Redeploy only TeamHub
force_redeploy_remotion: false # Redeploy only Remotion
force_redeploy_infrastructure: false # Redeploy databases
force_redeploy_nextcloud: false # Redeploy Nextcloud
```

### Command Line Usage

```bash
# Deploy with specific service redeployment
FORCE_REDEPLOY_NGINX=true ./infrastructure/scripts/deploy-application-enhanced.sh v1.0.0

# Deploy with multiple services
FORCE_REDEPLOY_NGINX=true FORCE_REDEPLOY_TEAMHUB=true ./infrastructure/scripts/deploy-application-enhanced.sh v1.0.0

# Deploy all services (equivalent to old FORCE_REDEPLOY=true)
FORCE_REDEPLOY_ALL=true ./infrastructure/scripts/deploy-application-enhanced.sh v1.0.0
```

## Service-Specific Considerations

### 🌐 Nginx Service

- **Config versioning**: Creates timestamped configs to avoid conflicts
- **Zero-downtime**: Uses Docker Swarm rolling updates
- **Safe to redeploy**: No data loss risk

**When to redeploy:**

- Configuration changes in `infrastructure/configs/nginx.conf`
- SSL certificate updates
- Routing rule changes

### 🎯 TeamHub Application

- **Stateless**: No persistent data in the container
- **Database connection**: Connects to PostgreSQL for data
- **Safe to redeploy**: Application data is in the database

**When to redeploy:**

- New application version
- Environment variable changes
- Performance issues

### 🎬 Remotion Service

- **Stateless rendering**: No persistent data
- **Resource intensive**: May take time to start
- **Safe to redeploy**: No data loss risk

**When to redeploy:**

- Rendering engine updates
- Performance optimization
- Memory issues

### 🔧 Infrastructure (PostgreSQL & Redis)

- **⚠️ DATA CRITICAL**: Contains all application data
- **Volume preservation**: Data is stored in Docker volumes
- **Careful redeployment**: Only redeploy when necessary

**Data volumes:**

- `teamhub_postgres_data`: All application data
- `teamhub_redis_data`: Cache and session data

**When to redeploy:**

- Database version upgrades
- Configuration changes
- Performance tuning
- **NOT for routine deployments**

### ☁️ Nextcloud Service

- **⚠️ DATA CRITICAL**: Contains user files and data
- **Volume preservation**: Files stored in Docker volumes
- **Database dependency**: Uses separate PostgreSQL instance

**Data volumes:**

- `teamhub_nextcloud_data`: User files and application data
- `teamhub_nextcloud_db_data`: Nextcloud database

**When to redeploy:**

- Nextcloud version updates
- Plugin installations
- Configuration changes
- **NOT for routine deployments**

## Data Safety Features

### Volume Detection

The system automatically detects existing data volumes:

```bash
🛡️  Checking data volume safety...
✅ PostgreSQL data volume exists (2.1GB)
✅ Redis data volume exists (45MB)
✅ Nextcloud data volume exists (1.2GB)
✅ Nextcloud DB data volume exists (156MB)
💾 Data volumes are preserved during service redeployment
```

### Backup Recommendations

Before redeploying infrastructure services:

```bash
# Backup PostgreSQL
docker exec $(docker ps -q -f name=teamhub_postgres) pg_dump -U teamhub teamhub > backup.sql

# Backup Nextcloud files
docker run --rm -v teamhub_nextcloud_data:/data -v $(pwd):/backup alpine tar czf /backup/nextcloud-backup.tar.gz /data

# Backup Nextcloud database
docker exec $(docker ps -q -f name=teamhub_nextcloud_db) pg_dump -U nextcloud nextcloud > nextcloud-backup.sql
```

## Migration from Legacy System

The enhanced system is backward compatible:

```bash
# Old way (still works)
FORCE_REDEPLOY=true ./infrastructure/scripts/deploy-application.sh v1.0.0

# New way (recommended)
FORCE_REDEPLOY_ALL=true ./infrastructure/scripts/deploy-application-enhanced.sh v1.0.0
```

## Troubleshooting

### Config Conflicts

If you encounter nginx config conflicts:

```bash
# Run the fix script on your server
./infrastructure/scripts/simple-config-fix.sh

# Or use the comprehensive fix
./infrastructure/scripts/fix-nginx-config-conflict.sh
```

### Service Health Checks

Monitor service health:

```bash
# Check all services
docker service ls --filter name=teamhub_

# Check specific service logs
docker service logs teamhub_nginx --tail 50
docker service logs teamhub_teamhub --tail 50

# Check data volumes
docker volume ls --filter name=teamhub_
docker system df -v | grep teamhub
```

### Rollback Strategy

If a deployment fails:

```bash
# Scale down problematic service
docker service scale teamhub_<service>=0

# Remove and redeploy with previous image
docker service rm teamhub_<service>
# Then redeploy with previous tag
```

## Best Practices

### 🚀 Routine Deployments

For regular application updates:

```bash
FORCE_REDEPLOY_TEAMHUB=true ./infrastructure/scripts/deploy-application-enhanced.sh v1.0.1
```

### 🔧 Configuration Updates

For nginx config changes:

```bash
FORCE_REDEPLOY_NGINX=true ./infrastructure/scripts/deploy-application-enhanced.sh v1.0.0
```

### 🛠️ Infrastructure Maintenance

For database updates (use with caution):

```bash
# Backup first!
FORCE_REDEPLOY_INFRASTRUCTURE=true ./infrastructure/scripts/deploy-application-enhanced.sh v1.0.0
```

### 📊 Monitoring

Always check the deployment summary:

- Service status
- Volume sizes
- Deployment scope
- Health check results

## Environment Variables Reference

| Variable                        | Description            | Default | Safe |
| ------------------------------- | ---------------------- | ------- | ---- |
| `FORCE_REDEPLOY_ALL`            | Redeploy all services  | `false` | ⚠️   |
| `FORCE_REDEPLOY_NGINX`          | Redeploy Nginx only    | `false` | ✅   |
| `FORCE_REDEPLOY_TEAMHUB`        | Redeploy TeamHub only  | `false` | ✅   |
| `FORCE_REDEPLOY_REMOTION`       | Redeploy Remotion only | `false` | ✅   |
| `FORCE_REDEPLOY_INFRASTRUCTURE` | Redeploy databases     | `false` | ⚠️   |
| `FORCE_REDEPLOY_NEXTCLOUD`      | Redeploy Nextcloud     | `false` | ⚠️   |
| `FORCE_REDEPLOY`                | Legacy option          | `false` | ⚠️   |

**Legend:**

- ✅ Safe: No data loss risk
- ⚠️ Caution: Potential data impact, backup recommended
