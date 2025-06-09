# Infrastructure Scripts

This directory contains scripts for building, optimizing, and deploying your Next.js application with Docker.

## 🚀 Quick Start

```bash
# 1. Set your container registry
export CONTAINER_REGISTRY=ghcr.io/your-username

# 2. Build optimized container
./infrastructure/scripts/build-and-push.sh v1.0.0

# 3. Deploy with enhanced features
./infrastructure/scripts/deploy-application-enhanced.sh v1.0.0
```

## 📄 Available Scripts

### `build-and-push.sh`

Builds and pushes optimized Docker images with size analysis.

**Usage:**

```bash
./infrastructure/scripts/build-and-push.sh [tag]

# Options via environment variables:
DOCKERFILE_VARIANT=optimized    # original | optimized | distroless
CONTAINER_REGISTRY=ghcr.io/user # Required
```

**Examples:**

```bash
# Build optimized image (recommended)
DOCKERFILE_VARIANT=optimized ./build-and-push.sh v1.0.0

# Build ultra-minimal image
DOCKERFILE_VARIANT=distroless ./build-and-push.sh v1.0.0

# Build original image (for comparison)
DOCKERFILE_VARIANT=original ./build-and-push.sh v1.0.0
```

### `deploy-application-enhanced.sh`

Enhanced deployment script with selective service redeployment and automatic image size logging.

**Usage:**

```bash
./infrastructure/scripts/deploy-application-enhanced.sh [tag]

# Environment variables:
CONTAINER_REGISTRY=ghcr.io/user     # Required
VERBOSE_DEPLOY=true                 # Show detailed analysis
FORCE_REDEPLOY_ALL=true            # Force redeployment of all services
FORCE_REDEPLOY_NGINX=true          # Force redeploy only nginx
FORCE_REDEPLOY_TEAMHUB=true        # Force redeploy only TeamHub
FORCE_REDEPLOY_REMOTION=true       # Force redeploy only Remotion
FORCE_REDEPLOY_INFRASTRUCTURE=true # Force redeploy only PostgreSQL/Redis
FORCE_REDEPLOY_NEXTCLOUD=true      # Force redeploy only Nextcloud
```

**Features:**

- ✅ Selective service redeployment
- ✅ Data volume safety checks
- ✅ Pre-deployment image size analysis
- ✅ Optimization recommendations
- ✅ Post-deployment summary
- ✅ Verbose layer analysis
- ✅ Enhanced nginx config management
- ✅ Automatic pgvector extension installation

### `deploy-with-size-analysis.sh`

Wrapper script for enhanced deployment with better UX.

**Usage:**

```bash
./infrastructure/scripts/deploy-with-size-analysis.sh [tag]
```

**Examples:**

```bash
# Basic deployment
export CONTAINER_REGISTRY=ghcr.io/your-username
./deploy-with-size-analysis.sh v1.0.0

# Verbose deployment
VERBOSE_DEPLOY=true ./deploy-with-size-analysis.sh v1.0.0

# Force redeploy
FORCE_REDEPLOY=true ./deploy-with-size-analysis.sh v1.0.0
```

### `compare-containers.sh`

Builds all container variants and compares their sizes.

**Usage:**

```bash
./infrastructure/scripts/compare-containers.sh
```

**Output:**

```
VARIANT              SIZE       DESCRIPTION
--------------------  ---------- -----------------------------------
Original             847MB      Standard Alpine + full node_modules
Optimized            156MB      Alpine + standalone output
Ultra-minimal        89MB       Distroless + standalone output
```

### `install-pgvector.sh`

Automatically installs the pgvector extension on all databases that need it.

**Usage:**

```bash
./infrastructure/scripts/install-pgvector.sh
```

**Features:**

- ✅ Auto-discovers all user databases
- ✅ Checks if pgvector is already installed
- ✅ Provides detailed diagnostics on failure
- ✅ Comprehensive installation summary
- ✅ Verification of successful installation

**Note:** This script is automatically run during deployment when PostgreSQL becomes ready.

### `redeploy-postgres-pgvector.sh`

**⚠️ DESTRUCTIVE OPERATION** - Completely redeploys PostgreSQL with pgvector support by destroying all existing data.

**Usage:**

```bash
./infrastructure/scripts/redeploy-postgres-pgvector.sh
```

**Warning:** This script will delete all PostgreSQL data. Only use if you need to migrate from a non-pgvector PostgreSQL to one with pgvector support.

## 📊 Image Size Analysis

The deployment scripts automatically analyze image sizes and provide recommendations:

### Size Categories:

- **🚀 Optimized**: < 200MB (Excellent!)
- **✅ Good**: 200MB - 500MB (Could be optimized further)
- **⚠️ Large**: > 500MB (Needs optimization)

### Recommendations:

- Large images → Use `Dockerfile.optimized` with standalone output
- Good images → Consider `Dockerfile.distroless` for maximum optimization
- Optimized images → You're doing great! 🎉

## 🔧 Environment Variables

| Variable             | Description             | Default     | Required |
| -------------------- | ----------------------- | ----------- | -------- |
| `CONTAINER_REGISTRY` | Container registry URL  | -           | ✅       |
| `DOCKERFILE_VARIANT` | Which Dockerfile to use | `optimized` | ❌       |
| `VERBOSE_DEPLOY`     | Show detailed analysis  | `false`     | ❌       |
| `FORCE_REDEPLOY`     | Force redeployment      | `false`     | ❌       |

## 📈 Optimization Results

Using the optimized Dockerfiles, you can expect:

- **90% size reduction** (800MB → 80MB)
- **80% faster deployments** (less data transfer)
- **Better security** (minimal attack surface)
- **Self-contained builds** (no external dependencies)

## 🛠️ Troubleshooting

### Issue: Permission denied

```bash
chmod +x infrastructure/scripts/*.sh
```

### Issue: Container registry authentication

```bash
# GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin

# Docker Hub
docker login -u $DOCKER_USERNAME
```

### Issue: Large image sizes

1. Check if `output: 'standalone'` is enabled in `next.config.mjs`
2. Use `DOCKERFILE_VARIANT=optimized` or `distroless`
3. Run `./compare-containers.sh` to see differences

## 📚 Related Documentation

- [`docs/container-optimization.md`](../../docs/container-optimization.md) - Complete optimization guide
- [`apps/teamhub/Dockerfile.optimized`](../../apps/teamhub/Dockerfile.optimized) - Optimized Dockerfile
- [`apps/teamhub/Dockerfile.distroless`](../../apps/teamhub/Dockerfile.distroless) - Ultra-minimal Dockerfile
