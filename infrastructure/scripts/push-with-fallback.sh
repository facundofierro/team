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

    # Tag for private registry
    docker tag $IMAGE_NAME:$TAG $REGISTRY_DOMAIN/$IMAGE_NAME:$TAG
    docker tag $IMAGE_NAME:latest $REGISTRY_DOMAIN/$IMAGE_NAME:latest

    # Try to push with optimized settings (only 2 attempts)
    for i in {1..2}; do
        echo "Attempt $i/2 to push to private registry..."

        export DOCKER_CLIENT_TIMEOUT=300
        export COMPOSE_HTTP_TIMEOUT=300

        if timeout 600 docker push --disable-content-trust $REGISTRY_DOMAIN/$IMAGE_NAME:$TAG && \
           timeout 600 docker push --disable-content-trust $REGISTRY_DOMAIN/$IMAGE_NAME:latest; then
            echo "✅ Successfully pushed to private registry"
            return 0
        else
            echo "❌ Push to private registry failed (attempt $i/2)"
            if [ $i -lt 2 ]; then
                echo "Retrying in 15 seconds..."
                sleep 15
            fi
        fi
    done

    return 1
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

# Try private registry first
if push_to_private_registry; then
    echo "Using private registry for deployment"
    echo "REGISTRY_FALLBACK=private" > /tmp/registry-fallback.env
    echo "PRIVATE_IMAGE=$REGISTRY_DOMAIN/$IMAGE_NAME:$TAG" >> /tmp/registry-fallback.env
    exit 0
fi

echo "Private registry push failed, trying DockerHub fallback..."

# Try DockerHub as fallback
if push_to_dockerhub; then
    echo "Using DockerHub for deployment"
    exit 0
fi

echo "❌ Both private registry and DockerHub pushes failed"
exit 1
