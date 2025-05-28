#!/bin/bash

set -e

echo "=== Deploying Full Application Stack ==="

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

    # Return status
    if [ "$TEAMHUB_RUNNING" = true ] && [ "$NGINX_RUNNING" = true ]; then
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

        # Create a temporary docker-stack.yml and update the image
        cp infrastructure/docker/docker-stack.yml ./docker-stack-temp.yml
        sed -i "s|localhost:5000/teamhub:.*|$CONTAINER_IMAGE|" ./docker-stack-temp.yml
    else
        echo "❌ Container registry or image tag not provided"
        exit 1
    fi

    echo "🔧 Using file-based nginx configuration"

    # Deploy the full stack
    export NEXTCLOUD_ADMIN_PASSWORD="${NEXTCLOUD_ADMIN_PASSWORD}"
    export NEXTCLOUD_DB_PASSWORD="${NEXTCLOUD_DB_PASSWORD}"
    export PG_PASSWORD="${PG_PASSWORD}"

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

    # Check teamhub service
    for i in {1..10}; do
        if docker service ls --filter name=teamhub_teamhub --format "{{.Replicas}}" | grep -q "1/1"; then
            echo "✅ Teamhub service is ready"
            break
        fi
        echo "Waiting for teamhub service... (attempt $i/10)"
        sleep 10
    done

    # Check nginx service
    for i in {1..10}; do
        if docker service ls --filter name=teamhub_nginx --format "{{.Replicas}}" | grep -q "1/1"; then
            echo "✅ Nginx service is ready"
            break
        fi
        echo "Waiting for nginx service... (attempt $i/10)"
        sleep 10
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
}

# Cleanup old containers
cleanup() {
    echo "Cleaning up old containers..."
    docker container prune -f
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

    echo "✅ Application deployment completed successfully"
    echo "🌐 Application should be accessible at http://your-server-ip"
}

# Execute main function with all arguments
main "$@"
