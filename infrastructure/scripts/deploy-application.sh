#!/bin/bash

set -e

echo "=== Deploying Full Application Stack ==="

# Setup infrastructure if needed
setup_infrastructure() {
    echo "🔧 Setting up infrastructure services (databases)..."

    # Check if infrastructure services already exist
    local POSTGRES_EXISTS=false
    local REDIS_EXISTS=false

    if docker service ls --filter name=teamhub_postgres --format "{{.Name}}" | grep -q teamhub_postgres; then
        echo "✅ PostgreSQL service already exists"
        POSTGRES_EXISTS=true
    fi

    if docker service ls --filter name=teamhub_redis --format "{{.Name}}" | grep -q teamhub_redis; then
        echo "✅ Redis service already exists"
        REDIS_EXISTS=true
    fi

    # If infrastructure exists and force redeploy is not enabled, skip setup
    if [ "$FORCE_REDEPLOY" != "true" ] && [ "$POSTGRES_EXISTS" = true ] && [ "$REDIS_EXISTS" = true ]; then
        echo "✅ Infrastructure already exists, skipping setup"
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

# Check if we're transitioning from infrastructure-only to full stack
check_transition_state() {
    if docker config ls --filter name=teamhub_nginx_infra_config --format "{{.Name}}" | grep -q teamhub_nginx_infra_config; then
        echo "🔄 Transitioning from infrastructure-only to full stack deployment"
        return 0
    else
        echo "🔄 Updating existing full stack deployment"
        return 1
    fi
}

# Deploy full application stack
deploy_full_stack() {
    local IMAGE_TAG="$1"
    local USING_INFRA_CONFIG=false

    if check_transition_state; then
        USING_INFRA_CONFIG=true
    fi

    echo "Deploying full application stack (including teamhub)..."

    # Use GitHub Container Registry image
    if [ -n "$CONTAINER_REGISTRY" ] && [ -n "$IMAGE_TAG" ]; then
        local CONTAINER_IMAGE="$CONTAINER_REGISTRY/teamhub:$IMAGE_TAG"
        echo "Using Container Registry image: $CONTAINER_IMAGE"
        sed -i "s|localhost:5000/teamhub:.*|$CONTAINER_IMAGE|" infrastructure/docker/docker-stack.yml
    else
        echo "❌ Container registry or image tag not provided"
        exit 1
    fi

    if [ "$USING_INFRA_CONFIG" = true ]; then
        # First deployment: transition from infrastructure to full stack
        echo "🚀 First deployment: Transitioning to full stack with nginx.conf"

        # Update the docker-stack.yml to use file-based config instead of external
        sed -i 's/external: true/file: .\/infrastructure\/configs\/nginx.conf/' infrastructure/docker/docker-stack.yml
        sed -i 's/name: teamhub_nginx_config_v4//' infrastructure/docker/docker-stack.yml

        # Deploy the full stack (nginx.conf is already checked out)
        export NEXTCLOUD_ADMIN_PASSWORD="${NEXTCLOUD_ADMIN_PASSWORD}"
        export NEXTCLOUD_DB_PASSWORD="${NEXTCLOUD_DB_PASSWORD}"
        export PG_PASSWORD="${PG_PASSWORD}"
        docker stack deploy -c infrastructure/docker/docker-stack.yml teamhub

        # Clean up the temporary infrastructure config after successful deployment
        echo "🧹 Cleaning up temporary infrastructure config"
        sleep 30  # Wait for deployment to complete
        docker config rm teamhub_nginx_infra_config 2>/dev/null || true

    else
        # Subsequent deployments: just update the stack
        echo "🔄 Updating existing full stack deployment"
        export NEXTCLOUD_ADMIN_PASSWORD="${NEXTCLOUD_ADMIN_PASSWORD}"
        export NEXTCLOUD_DB_PASSWORD="${NEXTCLOUD_DB_PASSWORD}"
        export PG_PASSWORD="${PG_PASSWORD}"
        docker stack deploy -c infrastructure/docker/docker-stack.yml teamhub
    fi

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

    # Setup infrastructure first
    setup_infrastructure

    # Deploy the full stack
    deploy_full_stack "$IMAGE_TAG"

    # Wait for services to be ready
    wait_for_services

    # Test application endpoints
    test_application

    # Cleanup
    cleanup

    echo "✅ Application deployment completed successfully"
    echo "🌐 Application should be accessible at http://your-server-ip"
}

# Execute main function with all arguments
main "$@"
