#!/bin/bash

set -e

echo "=== Deploying Full Application Stack ==="

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

    # Update docker-stack.yml with new image tag if provided
    if [ -n "$IMAGE_TAG" ]; then
        echo "Updating docker-stack.yml with image tag: $IMAGE_TAG"
        sed -i "s|localhost:5000/teamhub:.*|localhost:5000/teamhub:$IMAGE_TAG|" infrastructure/docker/docker-stack.yml
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

    # Test registry endpoint
    if curl -f --connect-timeout 5 --max-time 10 -u docker:k8mX9pL2nQ7vR4wE http://127.0.0.1:80/v2/ >/dev/null 2>&1; then
        echo "✅ Registry endpoint is accessible"
    else
        echo "❌ Registry endpoint is not accessible"
    fi

    # Test teamhub endpoint (if deployed)
    if docker service ls --filter name=teamhub_teamhub --format "{{.Name}}" | grep -q teamhub_teamhub; then
        if curl -f --connect-timeout 5 --max-time 10 http://127.0.0.1:80/ >/dev/null 2>&1; then
            echo "✅ Teamhub application is accessible"
        else
            echo "⚠️ Teamhub application may still be starting up"
        fi
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

    # Deploy the full stack
    deploy_full_stack "$IMAGE_TAG"

    # Wait for services to be ready
    wait_for_services

    # Test application endpoints
    test_application

    # Cleanup
    cleanup

    echo "✅ Application deployment completed successfully"
}

# Execute main function with all arguments
main "$@"
