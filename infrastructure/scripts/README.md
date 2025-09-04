# Infrastructure Scripts

This directory contains scripts for building, optimizing, and deploying your Next.js application with Docker.

## 🚀 Quick Start

```bash
# 1. Set your container registry
export CONTAINER_REGISTRY=ghcr.io/your-username

# 2. Deploy application (building is handled by CI/CD)
./infrastructure/scripts/deploy.sh v1.0.0
```

## 📄 Available Scripts

### `deploy.sh`

Main deployment script with selective service redeployment and automatic pgvector extension installation.

**Usage:**

```bash
./infrastructure/scripts/deploy.sh [tag]

# Environment variables:
CONTAINER_REGISTRY=ghcr.io/user     # Required
VERBOSE_DEPLOY=true                 # Show detailed analysis
FORCE_REDEPLOY_ALL=true            # Force redeployment of all services
FORCE_REDEPLOY_NGINX=true          # Force redeploy only nginx
FORCE_REDEPLOY_AGELUM=true        # Force redeploy only Agelum
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
3. Use different image variants in your deployment

## 📚 Related Documentation

- [`docs/container-optimization.md`](../../docs/container-optimization.md) - Complete optimization guide
- [`apps/agelum/Dockerfile.optimized`](../../apps/agelum/Dockerfile.optimized) - Optimized Dockerfile
- [`apps/agelum/Dockerfile.distroless`](../../apps/agelum/Dockerfile.distroless) - Ultra-minimal Dockerfile
