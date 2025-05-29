#!/bin/bash

set -e

echo "=== Building and Pushing Optimized Next.js Container ==="

# Configuration
IMAGE_NAME="teamhub"
DOCKERFILE_VARIANT="${DOCKERFILE_VARIANT:-optimized}" # options: original, optimized, distroless
REGISTRY="${CONTAINER_REGISTRY:-ghcr.io/your-org}"
TAG="${1:-latest}"

# Validate inputs
if [ -z "$CONTAINER_REGISTRY" ]; then
    echo "❌ CONTAINER_REGISTRY environment variable is required"
    echo "Example: export CONTAINER_REGISTRY=ghcr.io/your-org"
    exit 1
fi

# Choose Dockerfile based on variant
case $DOCKERFILE_VARIANT in
    "original")
        DOCKERFILE="apps/teamhub/Dockerfile"
        echo "🔧 Using original Dockerfile"
        ;;
    "optimized")
        DOCKERFILE="apps/teamhub/Dockerfile.optimized"
        echo "🚀 Using optimized Dockerfile (Alpine + standalone)"
        ;;
    "distroless")
        DOCKERFILE="apps/teamhub/Dockerfile.distroless"
        echo "⚡ Using ultra-minimal Dockerfile (Distroless + standalone)"
        ;;
    *)
        echo "❌ Invalid DOCKERFILE_VARIANT: $DOCKERFILE_VARIANT"
        echo "Valid options: original, optimized, distroless"
        exit 1
        ;;
esac

# Build the image
echo "📦 Building image: $REGISTRY/$IMAGE_NAME:$TAG"
echo "🐳 Using Dockerfile: $DOCKERFILE"

docker build \
    --file "$DOCKERFILE" \
    --tag "$REGISTRY/$IMAGE_NAME:$TAG" \
    --platform linux/amd64 \
    --progress=plain \
    .

# Get image sizes for comparison
echo "📊 Image size analysis:"
docker images "$REGISTRY/$IMAGE_NAME:$TAG" --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

# Push the image
echo "📤 Pushing image to registry..."
docker push "$REGISTRY/$IMAGE_NAME:$TAG"

echo "✅ Successfully built and pushed optimized image!"
echo "🏷️  Image: $REGISTRY/$IMAGE_NAME:$TAG"
echo "💡 To use distroless (smallest): DOCKERFILE_VARIANT=distroless $0 $TAG"
