#!/bin/bash

set -e

echo "=== Deploying Infrastructure Services ==="

# Check if teamhub image already exists in registry
check_teamhub_image() {
    echo "Checking if teamhub image exists in registry..."
    # Check HTTPS registry (Pinggy now forwards to port 443)
    if curl -f -k -u docker:k8mX9pL2nQ7vR4wE https://127.0.0.1:443/v2/teamhub/tags/list 2>/dev/null | grep -q "latest"; then
        echo "✅ Teamhub image already exists in registry (HTTPS)"
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

# Deploy infrastructure services (nginx + registry)
deploy_infrastructure() {
    echo "🚀 Deploying infrastructure services (nginx + registry)..."
    local FORCE_REDEPLOY="${1:-false}"

    # Ensure ports 80 and 443 are available for Docker nginx
    echo "Ensuring ports 80 and 443 are available..."
    netstat -tlnp | grep :80 || echo "Port 80 is free"
    netstat -tlnp | grep :443 || echo "Port 443 is free"

    # Setup registry if needed
    setup_registry

    # Check if infrastructure services already exist
    local NGINX_EXISTS=false
    local REGISTRY_EXISTS=false
    local NETWORK_EXISTS=false
    local CONFIG_EXISTS=false

    if docker service ls --filter name=teamhub_nginx --format "{{.Name}}" | grep -q teamhub_nginx; then
        echo "✅ Nginx service already exists"
        NGINX_EXISTS=true
    fi

    if docker service ls --filter name=teamhub_registry --format "{{.Name}}" | grep -q teamhub_registry; then
        echo "✅ Registry service already exists"
        REGISTRY_EXISTS=true
    fi

    if docker network ls --filter name=teamhub_registry_network --format "{{.Name}}" | grep -q teamhub_registry_network; then
        echo "✅ Registry network already exists"
        NETWORK_EXISTS=true
    fi

    if docker config ls --filter name=teamhub_nginx_infra_config --format "{{.Name}}" | grep -q teamhub_nginx_infra_config; then
        echo "✅ Infrastructure nginx config already exists"
        CONFIG_EXISTS=true
    fi

    # If all infrastructure components exist and force redeploy is not enabled, skip deployment
    if [ "$FORCE_REDEPLOY" != "true" ] && [ "$NGINX_EXISTS" = true ] && [ "$REGISTRY_EXISTS" = true ] && [ "$NETWORK_EXISTS" = true ] && [ "$CONFIG_EXISTS" = true ]; then
        echo "✅ All infrastructure services already exist and running, skipping deployment"
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

    # Create a temporary stack file with only infrastructure services
    cat > docker-stack-infra.yml << EOF
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    deploy:
      replicas: 1
    ports:
      - '80:80'
      - '443:443'
    configs:
      - source: ${CONFIG_NAME}
        target: /etc/nginx/nginx.conf
    volumes:
      - /opt/nginx-certs:/etc/nginx/ssl:ro
    networks:
      - registry_network

  registry:
    image: registry:2
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
    ports:
      - "5000:5000"
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

configs:
  ${CONFIG_NAME}:
    file: ./infrastructure/configs/nginx-infra.conf

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
    echo "Waiting for registry to be accessible through nginx..."

    for i in {1..15}; do
        # Check HTTPS registry (Pinggy now forwards to port 443)
        if curl -f -k --connect-timeout 5 --max-time 10 -u docker:k8mX9pL2nQ7vR4wE https://127.0.0.1:443/v2/ >/dev/null 2>&1; then
            echo "✅ Registry is accessible through nginx (HTTPS)"
            return 0
        fi
        echo "Waiting for registry to be ready... (attempt $i/15)"
        sleep 10
    done

    # Final check
    if curl -f -k --connect-timeout 5 --max-time 10 -u docker:k8mX9pL2nQ7vR4wE https://127.0.0.1:443/v2/ >/dev/null 2>&1; then
        echo "✅ Registry is accessible via HTTPS"
        return 0
    else
        echo "❌ Registry is still not accessible after 2.5 minutes"
        echo "Checking service status:"
        docker service ls
        echo "Registry logs:"
        docker service logs teamhub_registry --tail 20
        echo "Nginx logs:"
        docker service logs teamhub_nginx --tail 20
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
