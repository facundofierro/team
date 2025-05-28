#!/bin/bash

set -e

echo "=== Setting up Pinggy Tunnel for Docker Registry ==="

# Check if there's already a working registry tunnel
echo "Checking for existing registry tunnel..."
if curl -f --connect-timeout 5 --max-time 10 -u docker:k8mX9pL2nQ7vR4wE https://ukjhwjyazp.a.pinggy.link/v2/ >/dev/null 2>&1; then
    echo "✅ Existing registry tunnel is already working"
    echo "🔒 Skipping registry tunnel setup - using existing tunnel"
    exit 0
fi

# Stop any existing registry tunnels
pkill -f "ukjhwjyazp.a.pinggy.link" 2>/dev/null || true
pkill -f "registry-tunnel" 2>/dev/null || true

# Wait a moment for cleanup
sleep 2

echo "Starting registry tunnel to port 5000..."
echo "This tunnel forwards HTTPS traffic directly to registry port 5000"

# Start registry tunnel - forwards to localhost:5000 (registry service)
# Using the static subdomain ukjhwjyazp.a.pinggy.link with token FpyP2PGUXy0
echo "Starting registry tunnel with static subdomain..."
nohup ssh -p 443 -R0:localhost:5000 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 FpyP2PGUXy0@a.pinggy.io > /tmp/pinggy-registry.log 2>&1 &

PINGGY_PID=$!
echo "Pinggy registry tunnel started with PID: $PINGGY_PID"

# Wait for tunnel to establish
echo "Waiting for registry tunnel to establish..."
sleep 10

# Check if tunnel is running
if ps -p $PINGGY_PID > /dev/null; then
    echo "✅ Registry tunnel is running"

    # Extract the tunnel URL from logs
    sleep 5
    if [ -f /tmp/pinggy-registry.log ]; then
        echo "Registry tunnel information:"
        grep -E "(https://|http://)" /tmp/pinggy-registry.log | head -5 || echo "Check /tmp/pinggy-registry.log for tunnel URL"
    fi
else
    echo "❌ Registry tunnel failed to start"
    cat /tmp/pinggy-registry.log
    exit 1
fi

echo "🔒 Registry tunnel active - Docker registry accessible at https://ukjhwjyazp.a.pinggy.link"
echo "📁 Registry tunnel logs: /tmp/pinggy-registry.log"

# Test the registry endpoint
echo "Testing registry endpoint..."
sleep 5
if curl -f --connect-timeout 10 --max-time 30 -u docker:k8mX9pL2nQ7vR4wE https://ukjhwjyazp.a.pinggy.link/v2/ >/dev/null 2>&1; then
    echo "✅ Registry is accessible via tunnel"
else
    echo "⚠️ Registry test failed, but tunnel is running. May need more time to stabilize."
fi
