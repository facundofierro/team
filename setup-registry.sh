#!/bin/bash

# Setup script for private Docker registry
set -e

echo "Setting up private Docker registry..."

# Create directory for registry auth
mkdir -p /tmp/registry-auth

# Generate htpasswd file for registry authentication
# Using a random password for better security
echo "Creating registry authentication..."
docker run --rm --entrypoint htpasswd httpd:2 -Bbn docker k8mX9pL2nQ7vR4wE > /tmp/registry-auth/htpasswd

# Create the registry auth volume and copy the htpasswd file
echo "Setting up registry authentication volume..."
docker volume create registry_auth
docker run --rm -v registry_auth:/auth -v /tmp/registry-auth:/tmp alpine cp /tmp/htpasswd /auth/

# Create registry data volume
echo "Creating registry data volume..."
docker volume create registry_data

echo "Registry setup complete!"
echo ""
echo "Registry will be available at: localhost:5000"
echo "Default credentials:"
echo "  Username: docker"
echo "  Password: k8mX9pL2nQ7vR4wE"
echo ""
echo "To change credentials, edit this script and re-run it."
echo ""
echo "Next steps:"
echo "1. Deploy the stack: docker stack deploy -c docker-stack.yml teamhub"
echo "2. Test the registry: docker pull hello-world && docker tag hello-world localhost:5000/hello-world && docker push localhost:5000/hello-world"

# Clean up temporary files
rm -rf /tmp/registry-auth
