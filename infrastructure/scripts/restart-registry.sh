#!/bin/bash

set -e

echo "=== Restarting Docker Registry with Updated Configuration ==="

# Update the registry config
echo "Updating registry configuration..."
docker config create teamhub_registry_config_v2 infrastructure/configs/registry-config.yml 2>/dev/null || {
    echo "Config already exists, removing old one..."
    docker service update --config-rm teamhub_registry_config teamhub_registry 2>/dev/null || true
    docker config rm teamhub_registry_config 2>/dev/null || true
    docker config create teamhub_registry_config_v2 infrastructure/configs/registry-config.yml
}

# Update the nginx config
echo "Updating nginx configuration..."
docker config create teamhub_nginx_config_v5 infrastructure/configs/nginx.conf 2>/dev/null || {
    echo "Nginx config already exists, removing old one..."
    docker service update --config-rm teamhub_nginx_config_v4 teamhub_nginx 2>/dev/null || true
    docker config rm teamhub_nginx_config_v4 2>/dev/null || true
    docker config create teamhub_nginx_config_v5 infrastructure/configs/nginx.conf
}

# Update the docker-stack.yml to use the new config versions
sed -i 's/teamhub_registry_config/teamhub_registry_config_v2/' infrastructure/docker/docker-stack.yml
sed -i 's/teamhub_nginx_config_v4/teamhub_nginx_config_v5/' infrastructure/docker/docker-stack.yml

# Restart the registry and nginx services
echo "Restarting registry service..."
docker service update --force teamhub_registry

echo "Restarting nginx service..."
docker service update --force teamhub_nginx

echo "Waiting for services to stabilize..."
sleep 30

# Check service status
echo "Checking service status..."
docker service ls --filter name=teamhub_registry
docker service ls --filter name=teamhub_nginx

echo "✅ Registry and nginx services restarted with updated configuration"
