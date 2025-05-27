#!/bin/bash

set -e

echo "=== Configuring Docker for Insecure Registry Access ==="

# Get the server's local IP
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "Detected server IP: $SERVER_IP"

# Create Docker daemon configuration
DOCKER_CONFIG_DIR="/etc/docker"
DOCKER_CONFIG_FILE="$DOCKER_CONFIG_DIR/daemon.json"

# Helper function to run sudo commands with password if available
run_sudo() {
    if [ -n "$SUDO_PASSWORD" ]; then
        echo "$SUDO_PASSWORD" | sudo -S "$@"
    else
        sudo "$@"
    fi
}

# Create docker config directory if it doesn't exist
run_sudo mkdir -p "$DOCKER_CONFIG_DIR"

# Check if daemon.json already exists
if [ -f "$DOCKER_CONFIG_FILE" ]; then
    echo "Backing up existing daemon.json..."
    run_sudo cp "$DOCKER_CONFIG_FILE" "$DOCKER_CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Create new daemon.json with insecure registries
echo "Creating Docker daemon configuration..."
cat > /tmp/daemon.json << EOF
{
  "insecure-registries": [
    "$SERVER_IP",
    "$SERVER_IP:80",
    "localhost:5000",
    "127.0.0.1:5000",
    "r1.teamxagents.com"
  ],
  "registry-mirrors": [],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# Copy the configuration file
run_sudo cp /tmp/daemon.json "$DOCKER_CONFIG_FILE"
run_sudo chmod 644 "$DOCKER_CONFIG_FILE"

echo "✅ Docker daemon configuration updated"
echo "Configuration:"
cat "$DOCKER_CONFIG_FILE"

# Restart Docker daemon
echo "Restarting Docker daemon..."
run_sudo systemctl restart docker

# Wait for Docker to be ready
echo "Waiting for Docker to be ready..."
sleep 10

# Verify Docker is running
if run_sudo systemctl is-active --quiet docker; then
    echo "✅ Docker daemon restarted successfully"
else
    echo "❌ Docker daemon failed to restart"
    run_sudo systemctl status docker
    exit 1
fi

# Show insecure registries
echo "Current insecure registries:"
docker info | grep -A 10 "Insecure Registries" || echo "No insecure registries section found"

echo "✅ Docker configured for insecure registry access"
