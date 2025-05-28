#!/bin/bash

set -e

IMAGE_NAME="$1"
TAG="$2"
REGISTRY_DOMAIN="${3:-r1.teamxagents.com}"
DOCKERHUB_USERNAME="${4:-your-dockerhub-username}"

if [ -z "$IMAGE_NAME" ] || [ -z "$TAG" ]; then
    echo "Usage: $0 <image_name> <tag> [registry_domain] [dockerhub_username]"
    exit 1
fi

echo "Attempting to push $IMAGE_NAME:$TAG to private registry..."

# Function to push to private registry
push_to_private_registry() {
    echo "Pushing to private registry: $REGISTRY_DOMAIN"

    # Login to registry
    echo "Logging in to registry..."
    echo "k8mX9pL2nQ7vR4wE" | docker login $REGISTRY_DOMAIN -u docker --password-stdin

    # Tag for private registry
    docker tag $IMAGE_NAME:$TAG $REGISTRY_DOMAIN/$IMAGE_NAME:$TAG
    docker tag $IMAGE_NAME:latest $REGISTRY_DOMAIN/$IMAGE_NAME:latest

    # Push to registry
    echo "Pushing images to registry..."
    docker push $REGISTRY_DOMAIN/$IMAGE_NAME:$TAG
    docker push $REGISTRY_DOMAIN/$IMAGE_NAME:latest

    echo "✅ Successfully pushed to private registry"
    return 0
}

# Function to push to DockerHub
push_to_dockerhub() {
    echo "Pushing to DockerHub as fallback..."

    # Tag for DockerHub
    docker tag $IMAGE_NAME:$TAG $DOCKERHUB_USERNAME/$IMAGE_NAME:$TAG
    docker tag $IMAGE_NAME:latest $DOCKERHUB_USERNAME/$IMAGE_NAME:latest

    # Push to DockerHub
    if docker push $DOCKERHUB_USERNAME/$IMAGE_NAME:$TAG && \
       docker push $DOCKERHUB_USERNAME/$IMAGE_NAME:latest; then
        echo "✅ Successfully pushed to DockerHub"

        # Update deployment to use DockerHub image
        echo "REGISTRY_FALLBACK=dockerhub" > /tmp/registry-fallback.env
        echo "DOCKERHUB_IMAGE=$DOCKERHUB_USERNAME/$IMAGE_NAME:$TAG" >> /tmp/registry-fallback.env

        return 0
    else
        echo "❌ Push to DockerHub also failed"
        return 1
    fi
}

# Push to private registry
push_to_private_registry

echo "Using private registry for deployment"
echo "REGISTRY_FALLBACK=private" > /tmp/registry-fallback.env
echo "PRIVATE_IMAGE=$REGISTRY_DOMAIN/$IMAGE_NAME:$TAG" >> /tmp/registry-fallback.env
