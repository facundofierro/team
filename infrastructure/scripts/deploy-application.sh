#!/bin/bash

set -e

echo "=== Deploying Full Application Stack ==="

# Log Docker image size information
log_image_size_info() {
    local IMAGE_NAME="$1"

    echo ""
    echo "📊 ===== Docker Image Size Analysis ====="

    # Try to pull the image to get accurate size info
    echo "🔍 Pulling image to get size information..."
    if docker pull "$IMAGE_NAME" >/dev/null 2>&1; then
        echo "✅ Successfully pulled image: $IMAGE_NAME"

        # Get detailed image information
        local IMAGE_SIZE=$(docker images "$IMAGE_NAME" --format "{{.Size}}")
        local IMAGE_ID=$(docker images "$IMAGE_NAME" --format "{{.ID}}")
        local CREATED_DATE=$(docker images "$IMAGE_NAME" --format "{{.CreatedAt}}")

        echo ""
        echo "📋 Image Details:"
        echo "  🏷️  Image: $IMAGE_NAME"
        echo "  💾 Size: $IMAGE_SIZE"
        echo "  🆔 ID: $IMAGE_ID"
        echo "  📅 Created: $CREATED_DATE"

        # Check if this looks like an optimized image based on size
        local SIZE_NUM=$(echo "$IMAGE_SIZE" | sed 's/[^0-9.]//g' | head -c 10)
        local SIZE_UNIT=$(echo "$IMAGE_SIZE" | sed 's/[0-9.]//g' | tr -d ' ')

        echo ""
        echo "🎯 Optimization Analysis:"

        # Rough size analysis (convert to MB for comparison)
        if [[ "$SIZE_UNIT" == *"GB"* ]]; then
            local SIZE_MB=$(echo "$SIZE_NUM * 1000" | bc -l 2>/dev/null || echo "1000")
        elif [[ "$SIZE_UNIT" == *"MB"* ]]; then
            local SIZE_MB="$SIZE_NUM"
        else
            local SIZE_MB="0"
        fi

        # Provide recommendations based on size
        if (( $(echo "$SIZE_MB > 500" | bc -l 2>/dev/null || echo "1") )); then
            echo "  ⚠️  Large container detected ($IMAGE_SIZE)"
            echo "  💡 Consider using optimized Dockerfile with standalone output"
            echo "  📖 See: docs/container-optimization.md"
        elif (( $(echo "$SIZE_MB > 200" | bc -l 2>/dev/null || echo "0") )); then
            echo "  ✅ Medium-sized container ($IMAGE_SIZE)"
            echo "  💡 Could be further optimized with distroless base"
        else
            echo "  🚀 Optimized container detected ($IMAGE_SIZE)"
            echo "  ✅ Excellent size optimization!"
        fi

        # Show layer information if verbose mode is enabled
        if [ "$VERBOSE_DEPLOY" = "true" ]; then
            echo ""
            echo "🔍 Layer Analysis:"
            docker history "$IMAGE_NAME" --format "table {{.CreatedBy}}\t{{.Size}}" | head -10
        fi

    else
        echo "⚠️  Could not pull image for size analysis"
        echo "🔍 Image: $IMAGE_NAME"
        echo "💭 Size information will be available after deployment"
    fi

    echo "============================================"
    echo ""
}

# Check if infrastructure services are already running and healthy
check_infrastructure_status() {
    echo "🔍 Checking infrastructure status..."

    local POSTGRES_RUNNING=false
    local REDIS_RUNNING=false
    local POSTGRES_HEALTHY=false
    local REDIS_HEALTHY=false

    # Check if services exist and are running
    if docker service ls --filter name=teamhub_postgres --format "{{.Name}}" | grep -q teamhub_postgres; then
        if docker service ls --filter name=teamhub_postgres --format "{{.Replicas}}" | grep -q "1/1"; then
            POSTGRES_RUNNING=true
            echo "✅ PostgreSQL service is running"
        else
            echo "⚠️ PostgreSQL service exists but not ready"
        fi
    else
        echo "❌ PostgreSQL service not found"
    fi

    if docker service ls --filter name=teamhub_redis --format "{{.Name}}" | grep -q teamhub_redis; then
        if docker service ls --filter name=teamhub_redis --format "{{.Replicas}}" | grep -q "1/1"; then
            REDIS_RUNNING=true
            echo "✅ Redis service is running"
        else
            echo "⚠️ Redis service exists but not ready"
        fi
    else
        echo "❌ Redis service not found"
    fi

    # Test health of running services
    if [ "$POSTGRES_RUNNING" = true ]; then
        # Test PostgreSQL connectivity through docker service
        if docker service logs teamhub_postgres 2>/dev/null | tail -20 | grep -q "database system is ready to accept connections"; then
            POSTGRES_HEALTHY=true
            echo "✅ PostgreSQL is healthy"
        else
            echo "⚠️ PostgreSQL may not be healthy"
        fi
    fi

    if [ "$REDIS_RUNNING" = true ]; then
        # Redis is typically ready if the service is running
        REDIS_HEALTHY=true
        echo "✅ Redis is healthy"
    fi

    # Return status
    if [ "$POSTGRES_HEALTHY" = true ] && [ "$REDIS_HEALTHY" = true ]; then
        echo "✅ Infrastructure is healthy and ready"
        return 0
    else
        echo "❌ Infrastructure needs setup"
        return 1
    fi
}

# Setup infrastructure if needed
setup_infrastructure() {
    echo "🔧 Setting up infrastructure services (databases)..."

    # Check if we should skip infrastructure setup
    if [ "$FORCE_REDEPLOY" != "true" ] && check_infrastructure_status; then
        echo "✅ Infrastructure already exists and is healthy, skipping setup"
        return 0
    fi

    # Create infrastructure services
    echo "🚀 Creating infrastructure services..."

    # Create temporary infrastructure stack
    cat > /tmp/docker-stack-infra.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:15
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
    environment:
      - POSTGRES_DB=teamhub
      - POSTGRES_USER=teamhub
      - POSTGRES_PASSWORD=\${PG_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - default

  redis:
    image: redis:7-alpine
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
    volumes:
      - redis_data:/data
    networks:
      - default

volumes:
  postgres_data:
  redis_data:

networks:
  default:
    driver: overlay
EOF

    # Deploy infrastructure
    docker stack deploy -c /tmp/docker-stack-infra.yml teamhub

    # Wait for infrastructure to be ready
    echo "Waiting for infrastructure services..."
    sleep 20

    # Wait for PostgreSQL
    for i in {1..10}; do
        if docker service ls --filter name=teamhub_postgres --format "{{.Replicas}}" | grep -q "1/1"; then
            echo "✅ PostgreSQL is ready"
            break
        fi
        echo "Waiting for PostgreSQL... (attempt $i/10)"
        sleep 10
    done

    # Wait for Redis
    for i in {1..10}; do
        if docker service ls --filter name=teamhub_redis --format "{{.Replicas}}" | grep -q "1/1"; then
            echo "✅ Redis is ready"
            break
        fi
        echo "Waiting for Redis... (attempt $i/10)"
        sleep 10
    done

    # Clean up temporary file
    rm -f /tmp/docker-stack-infra.yml
    echo "✅ Infrastructure setup completed"
}

# Check if full stack is already deployed
check_full_stack_status() {
    echo "🔍 Checking full application stack status..."

    local TEAMHUB_RUNNING=false
    local NGINX_RUNNING=false
    local REMOTION_RUNNING=false

    # Check if teamhub service exists and is running
    if docker service ls --filter name=teamhub_teamhub --format "{{.Name}}" | grep -q teamhub_teamhub; then
        if docker service ls --filter name=teamhub_teamhub --format "{{.Replicas}}" | grep -q "1/1"; then
            TEAMHUB_RUNNING=true
            echo "✅ Teamhub service is running"
        else
            echo "⚠️ Teamhub service exists but not ready"
        fi
    else
        echo "❌ Teamhub service not found"
    fi

    # Check if nginx service exists and is running
    if docker service ls --filter name=teamhub_nginx --format "{{.Name}}" | grep -q teamhub_nginx; then
        if docker service ls --filter name=teamhub_nginx --format "{{.Replicas}}" | grep -q "1/1"; then
            NGINX_RUNNING=true
            echo "✅ Nginx service is running"
        else
            echo "⚠️ Nginx service exists but not ready"
        fi
    else
        echo "❌ Nginx service not found"
    fi

    # Check if remotion service exists and is running
    if docker service ls --filter name=teamhub_remotion --format "{{.Name}}" | grep -q teamhub_remotion; then
        if docker service ls --filter name=teamhub_remotion --format "{{.Replicas}}" | grep -q "1/1"; then
            REMOTION_RUNNING=true
            echo "✅ Remotion service is running"
        else
            echo "⚠️ Remotion service exists but not ready"
        fi
    else
        echo "❌ Remotion service not found"
    fi

    # Return status
    if [ "$TEAMHUB_RUNNING" = true ] && [ "$NGINX_RUNNING" = true ] && [ "$REMOTION_RUNNING" = true ]; then
        echo "✅ Full application stack is running"
        return 0
    else
        echo "❌ Full application stack needs deployment"
        return 1
    fi
}

# Deploy full application stack
deploy_full_stack() {
    local IMAGE_TAG="$1"

    echo "🚀 Deploying full application stack..."

    # Use GitHub Container Registry image
    if [ -n "$CONTAINER_REGISTRY" ] && [ -n "$IMAGE_TAG" ]; then
        local CONTAINER_IMAGE="$CONTAINER_REGISTRY/teamhub:$IMAGE_TAG"
        echo "Using Container Registry image: $CONTAINER_IMAGE"

        # Log image size information
        log_image_size_info "$CONTAINER_IMAGE"

        # Create a temporary docker-stack.yml and update the image
        cp infrastructure/docker/docker-stack.yml ./docker-stack-temp.yml
        sed -i "s|localhost:5000/teamhub:.*|$CONTAINER_IMAGE|" ./docker-stack-temp.yml

        # Update remotion image if REMOTION_IMAGE is provided
        if [ -n "$REMOTION_IMAGE" ]; then
            echo "Using Remotion image: $REMOTION_IMAGE"
            sed -i "s|\${REMOTION_IMAGE:-.*}|$REMOTION_IMAGE|" ./docker-stack-temp.yml
        fi
    else
        echo "❌ Container registry or image tag not provided"
        exit 1
    fi

    echo "🔧 Using file-based nginx configuration"

    # Check for potential configuration conflicts
    echo "🔍 Checking for configuration conflicts..."

    # Remove any conflicting old configs if they exist
    if docker config ls --filter name=teamhub_registry_config --format "{{.Name}}" | grep -q teamhub_registry_config; then
        echo "⚠️  Removing old registry config that conflicts with new deployment..."
        docker config rm teamhub_registry_config || true
    fi


    # Deploy the full stack
    export NEXTCLOUD_ADMIN_PASSWORD="${NEXTCLOUD_ADMIN_PASSWORD}"
    export NEXTCLOUD_DB_PASSWORD="${NEXTCLOUD_DB_PASSWORD}"
    export PG_PASSWORD="${PG_PASSWORD}"
    export REMOTION_IMAGE="${REMOTION_IMAGE}"

    echo "🚀 Deploying application stack..."
    docker stack deploy -c ./docker-stack-temp.yml teamhub

    # Clean up temporary file
    rm -f ./docker-stack-temp.yml

    echo "Waiting for teamhub service to be ready..."
    sleep 30
}

# Wait for services to be ready
wait_for_services() {
    echo "Waiting for all services to be ready..."

    # Check teamhub service first
    for i in {1..15}; do
        if docker service ls --filter name=teamhub_teamhub --format "{{.Replicas}}" | grep -q "1/1"; then
            echo "✅ Teamhub service is ready"
            break
        fi
        if [ $i -eq 15 ]; then
            echo "❌ Teamhub service failed to start after 15 attempts"
            echo "🔍 Checking teamhub service logs:"
            docker service logs teamhub_teamhub --tail 20 || true
        else
            echo "Waiting for teamhub service... (attempt $i/15)"
            sleep 10
        fi
    done

    # Check remotion service before nginx (nginx depends on remotion)
    for i in {1..15}; do
        if docker service ls --filter name=teamhub_remotion --format "{{.Replicas}}" | grep -q "1/1"; then
            echo "✅ Remotion service is ready"
            break
        fi
        if [ $i -eq 15 ]; then
            echo "❌ Remotion service failed to start after 15 attempts"
            echo "🔍 Checking remotion service logs:"
            docker service logs teamhub_remotion --tail 20 || true
        else
            echo "Waiting for remotion service... (attempt $i/15)"
            sleep 10
        fi
    done

    # Check nginx service last (after dependencies are ready)
    for i in {1..15}; do
        if docker service ls --filter name=teamhub_nginx --format "{{.Replicas}}" | grep -q "1/1"; then
            echo "✅ Nginx service is ready"
            break
        fi
        if [ $i -eq 15 ]; then
            echo "❌ Nginx service failed to start after 15 attempts"
            echo "🔍 Checking nginx service logs:"
            docker service logs teamhub_nginx --tail 20 || true
        else
            echo "Waiting for nginx service... (attempt $i/15)"
            sleep 10
        fi
    done
}

# Test application endpoints
test_application() {
    echo "Testing application endpoints..."

    # Test teamhub endpoint
    if docker service ls --filter name=teamhub_teamhub --format "{{.Name}}" | grep -q teamhub_teamhub; then
        if curl -f --connect-timeout 5 --max-time 10 http://127.0.0.1:80/ >/dev/null 2>&1; then
            echo "✅ Teamhub application is accessible"
        else
            echo "⚠️ Teamhub application may still be starting up"
        fi
    fi

    # Test nginx service
    if curl -f --connect-timeout 5 --max-time 10 http://127.0.0.1:80/health >/dev/null 2>&1; then
        echo "✅ Nginx service is accessible"
    else
        echo "⚠️ Nginx service may still be starting up"
    fi

    # Test remotion endpoint
    if curl -f --connect-timeout 5 --max-time 10 http://127.0.0.1:80/remotion/ >/dev/null 2>&1; then
        echo "✅ Remotion service is accessible"
    else
        echo "⚠️ Remotion service may still be starting up"
    fi
}

# Cleanup old containers
cleanup() {
    echo "Cleaning up old containers..."
    docker container prune -f
}

# Show deployment summary with image sizes
show_deployment_summary() {
    local IMAGE_TAG="$1"

    echo ""
    echo "📊 ===== Deployment Summary ====="
    echo ""
    echo "🚀 Successfully deployed application stack!"
    echo ""

    # Show running services
    echo "🔍 Running Services:"
    docker service ls --filter name=teamhub_ --format "table {{.Name}}\t{{.Replicas}}\t{{.Image}}" | grep -E "(NAME|teamhub_)"

    echo ""
    echo "📦 Deployed Image Sizes:"

    # Get images used by the services
    local TEAMHUB_IMAGE=$(docker service inspect teamhub_teamhub --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' 2>/dev/null || echo "N/A")
    local NGINX_IMAGE=$(docker service inspect teamhub_nginx --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' 2>/dev/null || echo "N/A")
    local REMOTION_IMAGE=$(docker service inspect teamhub_remotion --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}' 2>/dev/null || echo "N/A")

    # Show teamhub image size (main application)
    if [ "$TEAMHUB_IMAGE" != "N/A" ]; then
        local TEAMHUB_SIZE=$(docker images "$TEAMHUB_IMAGE" --format "{{.Size}}" 2>/dev/null || echo "Unknown")
        echo "  🎯 TeamHub: $TEAMHUB_SIZE ($TEAMHUB_IMAGE)"

        # Provide optimization recommendations
        local SIZE_NUM=$(echo "$TEAMHUB_SIZE" | sed 's/[^0-9.]//g' | head -c 10)
        local SIZE_UNIT=$(echo "$TEAMHUB_SIZE" | sed 's/[0-9.]//g' | tr -d ' ')

        if [[ "$SIZE_UNIT" == *"GB"* ]]; then
            echo "    💡 Large image detected - consider using optimized Dockerfile"
        elif [[ "$SIZE_UNIT" == *"MB"* ]] && (( $(echo "$SIZE_NUM > 200" | bc -l 2>/dev/null || echo "0") )); then
            echo "    ✅ Good size - could be further optimized with distroless"
        else
            echo "    🚀 Excellent optimization!"
        fi
    fi

    # Show other images
    if [ "$NGINX_IMAGE" != "N/A" ]; then
        local NGINX_SIZE=$(docker images "$NGINX_IMAGE" --format "{{.Size}}" 2>/dev/null || echo "Unknown")
        echo "  🌐 Nginx: $NGINX_SIZE ($NGINX_IMAGE)"
    fi

    if [ "$REMOTION_IMAGE" != "N/A" ]; then
        local REMOTION_SIZE=$(docker images "$REMOTION_IMAGE" --format "{{.Size}}" 2>/dev/null || echo "Unknown")
        echo "  🎬 Remotion: $REMOTION_SIZE ($REMOTION_IMAGE)"
    fi

    echo ""
    echo "💾 Total Image Storage:"
    local TOTAL_SIZE=$(docker images --filter "reference=*teamhub*" --format "{{.Size}}" | head -3 | paste -sd+ - | bc 2>/dev/null || echo "Calculating...")
    echo "  📏 Estimated total: $(docker system df --format "{{.Size}}" | head -1 || echo "Run 'docker system df' for details")"

    echo ""
    echo "🎯 Quick Actions:"
    echo "  • View logs: docker service logs teamhub_teamhub"
    echo "  • Scale service: docker service scale teamhub_teamhub=N"
    echo "  • Optimize images: See docs/container-optimization.md"
    echo ""
    echo "🌐 Application URL: http://your-server-ip"
    echo "============================================"
}

# Main deployment function
main() {
    local IMAGE_TAG="$1"

    if [ -z "$IMAGE_TAG" ]; then
        echo "❌ Image tag is required"
        echo "Usage: $0 <image_tag>"
        exit 1
    fi

    if [ -z "$CONTAINER_REGISTRY" ]; then
        echo "❌ CONTAINER_REGISTRY environment variable is required"
        exit 1
    fi

    echo "🚀 Starting deployment with Container Registry image: $CONTAINER_REGISTRY/teamhub:$IMAGE_TAG"

    # Enable verbose logging if requested
    if [ "$VERBOSE_DEPLOY" = "true" ]; then
        echo "🔍 Verbose logging enabled"
        echo "📊 Additional image analysis will be shown"
    fi

    # Stage 1: Setup infrastructure first (if needed)
    echo "=== STAGE 1: Infrastructure Setup ==="
    setup_infrastructure

    # Stage 2: Deploy the full stack (if needed or if force redeploy)
    echo "=== STAGE 2: Application Deployment ==="
    if [ "$FORCE_REDEPLOY" = "true" ] || ! check_full_stack_status; then
        deploy_full_stack "$IMAGE_TAG"

        # Wait for services to be ready
        wait_for_services

        # Test application endpoints
        test_application
    else
        echo "✅ Full application stack already running, skipping deployment"
        echo "💡 Use FORCE_REDEPLOY=true to force redeployment"
    fi

    # Cleanup
    cleanup

    # Show deployment summary
    show_deployment_summary "$IMAGE_TAG"

    echo "✅ Application deployment completed successfully"
    echo "🌐 Application should be accessible at http://your-server-ip"
}

# Execute main function with all arguments
main "$@"
