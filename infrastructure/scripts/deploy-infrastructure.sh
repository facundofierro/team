#!/bin/bash

set -e

echo "=== Deploying Infrastructure Services ==="

# Check if teamhub image already exists in registry
check_teamhub_image() {
    echo "Checking if teamhub image exists in registry..."
    # Check registry directly on port 5000
    if curl -f -u docker:k8mX9pL2nQ7vR4wE http://127.0.0.1:5000/v2/teamhub/tags/list 2>/dev/null | grep -q "latest"; then
        echo "✅ Teamhub image already exists in registry"
        return 0
    else
        echo "ℹ️ Teamhub image not found in registry - first deployment"
        return 1
    fi
}

# Check if full stack is already deployed
check_full_stack() {
    echo "Checking if full stack is deployed..."
    if docker service ls --filter name=teamhub_teamhub --format "{{.Name}}" | grep -q teamhub_teamhub; then
        echo "✅ Full stack already deployed"
        return 0
    else
        echo "ℹ️ Full stack not deployed yet"
        return 1
    fi
}

# Setup registry volumes and authentication
setup_registry() {
    echo "Setting up registry volumes and authentication..."

    # Check if registry volumes exist
    if ! docker volume ls --filter name=registry_data --format "{{.Name}}" | grep -q registry_data; then
        echo "Registry volumes not found. Running setup script..."
        chmod +x infrastructure/docker/setup-registry.sh
        infrastructure/docker/setup-registry.sh
    else
        echo "✅ Registry volumes already exist"
    fi
}

# Deploy infrastructure services (registry only)
deploy_infrastructure() {
    echo "🚀 Deploying infrastructure services (registry only)..."
    local FORCE_REDEPLOY="${1:-false}"

    # Ensure port 5000 is available for Docker registry
    echo "Ensuring port 5000 is available..."
    netstat -tlnp | grep :5000 || echo "Port 5000 is free"

    # Setup registry if needed
    setup_registry

    # Check if infrastructure services already exist
    local REGISTRY_EXISTS=false
    local NETWORK_EXISTS=false

    if docker service ls --filter name=teamhub_registry --format "{{.Name}}" | grep -q teamhub_registry; then
        echo "✅ Registry service already exists"
        REGISTRY_EXISTS=true
    fi

    if docker network ls --filter name=teamhub_registry_network --format "{{.Name}}" | grep -q teamhub_registry_network; then
        echo "✅ Registry network already exists"
        NETWORK_EXISTS=true
    fi

    # If all infrastructure components exist and force redeploy is not enabled, skip deployment
    if [ "$FORCE_REDEPLOY" != "true" ] && [ "$REGISTRY_EXISTS" = true ] && [ "$NETWORK_EXISTS" = true ]; then
        echo "✅ Registry infrastructure already exists and running, skipping deployment"
        wait_for_registry
        return 0
    fi

    # If force redeploy is enabled, we'll create a new config with a timestamp
    if [ "$FORCE_REDEPLOY" = "true" ]; then
        echo "🔄 Force redeploy enabled - will create new config with timestamp"
        CONFIG_EXISTS=false
    fi

    # Create a timestamp for unique config name
    TIMESTAMP=$(date +%s)
    CONFIG_NAME="nginx_infra_config_${TIMESTAMP}"

    # Create a temporary stack file with only registry service (no nginx needed)
    cat > docker-stack-infra.yml << EOF
version: '3.8'
services:
  registry:
    image: registry:2
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
    ports:
      - "127.0.0.1:5000:5000"
    environment:
      - REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY=/var/lib/registry
      - REGISTRY_AUTH=htpasswd
      - REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm
      - REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd
    volumes:
      - registry_data:/var/lib/registry
      - registry_auth:/auth
    networks:
      - registry_network

volumes:
  registry_data:
  registry_auth:

networks:
  registry_network:
    driver: overlay
EOF

    # Create new infrastructure config with timestamp
    if [ "$CONFIG_EXISTS" = false ]; then
        echo "Creating new infrastructure config: ${CONFIG_NAME}"
    fi

    # Deploy infrastructure services (this will update existing services or create new ones)
    echo "Deploying/updating infrastructure services (nginx + registry)..."
    export PG_PASSWORD="${PG_PASSWORD}"
    docker stack deploy -c docker-stack-infra.yml teamhub

    echo "Waiting for infrastructure services to be ready..."
    sleep 30

    # Wait for registry to be accessible through nginx
    wait_for_registry
}

# Wait for registry to be accessible
wait_for_registry() {
    echo "Waiting for registry to be accessible on port 5000..."

    for i in {1..15}; do
        # Check registry directly on port 5000
        if curl -f --connect-timeout 5 --max-time 10 -u docker:k8mX9pL2nQ7vR4wE http://127.0.0.1:5000/v2/ >/dev/null 2>&1; then
            echo "✅ Registry is accessible on port 5000"
            return 0
        fi
        echo "Waiting for registry to be ready... (attempt $i/15)"
        sleep 10
    done

    # Final check
    if curl -f --connect-timeout 5 --max-time 10 -u docker:k8mX9pL2nQ7vR4wE http://127.0.0.1:5000/v2/ >/dev/null 2>&1; then
        echo "✅ Registry is accessible on port 5000"
        return 0
    else
        echo "❌ Registry is still not accessible after 2.5 minutes"
        echo "Checking service status:"
        docker service ls
        echo "Registry logs:"
        docker service logs teamhub_registry --tail 20
        exit 1
    fi
}

# Main deployment logic
main() {
    local TEAMHUB_EXISTS=false
    local FULL_STACK_EXISTS=false
    local FORCE_REDEPLOY="${1:-false}"

    echo "Force redeploy flag: $FORCE_REDEPLOY"

    # Check current state
    if check_teamhub_image; then
        TEAMHUB_EXISTS=true
    fi

    if check_full_stack; then
        FULL_STACK_EXISTS=true
    fi

    # Deploy infrastructure if:
    # 1. Force redeploy is enabled, OR
    # 2. teamhub image doesn't exist and full stack isn't deployed
    if [ "$FORCE_REDEPLOY" = "true" ]; then
        echo "🔄 Force redeploy enabled - redeploying infrastructure services"
        deploy_infrastructure "$FORCE_REDEPLOY"
    elif [ "$TEAMHUB_EXISTS" = false ] && [ "$FULL_STACK_EXISTS" = false ]; then
        deploy_infrastructure "$FORCE_REDEPLOY"
    else
        echo "✅ Infrastructure already exists, skipping infrastructure deployment"
    fi
}

# Execute main function
main "$@"
