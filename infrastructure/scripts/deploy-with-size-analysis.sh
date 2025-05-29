#!/bin/bash

set -e

echo "=== Enhanced Deployment with Image Size Analysis ==="

# Configuration
IMAGE_TAG="${1:-latest}"
CONTAINER_REGISTRY="${CONTAINER_REGISTRY}"
VERBOSE_DEPLOY="${VERBOSE_DEPLOY:-false}"

# Show usage if needed
if [ -z "$CONTAINER_REGISTRY" ]; then
    echo "❌ CONTAINER_REGISTRY environment variable is required"
    echo ""
    echo "Usage:"
    echo "  export CONTAINER_REGISTRY=ghcr.io/your-username"
    echo "  $0 [image_tag]"
    echo ""
    echo "Options:"
    echo "  VERBOSE_DEPLOY=true   - Show detailed image layer analysis"
    echo "  FORCE_REDEPLOY=true   - Force redeployment even if running"
    echo ""
    echo "Examples:"
    echo "  # Basic deployment with size analysis"
    echo "  export CONTAINER_REGISTRY=ghcr.io/your-username"
    echo "  $0 v1.0.0"
    echo ""
    echo "  # Verbose deployment with detailed analysis"
    echo "  VERBOSE_DEPLOY=true $0 v1.0.0"
    echo ""
    echo "  # Force redeploy with analysis"
    echo "  FORCE_REDEPLOY=true $0 v1.0.0"
    exit 1
fi

echo "📋 Deployment Configuration:"
echo "  🏷️  Image Tag: $IMAGE_TAG"
echo "  📦 Registry: $CONTAINER_REGISTRY"
echo "  🔍 Verbose: $VERBOSE_DEPLOY"
echo "  🔄 Force Redeploy: ${FORCE_REDEPLOY:-false}"
echo ""

# Export variables for the deployment script
export CONTAINER_REGISTRY="$CONTAINER_REGISTRY"
export VERBOSE_DEPLOY="$VERBOSE_DEPLOY"
export FORCE_REDEPLOY="${FORCE_REDEPLOY:-false}"

# Run the deployment with enhanced logging
echo "🚀 Starting enhanced deployment..."
exec infrastructure/scripts/deploy-application.sh "$IMAGE_TAG"
