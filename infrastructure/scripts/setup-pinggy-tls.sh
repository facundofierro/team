#!/bin/bash

set -e

echo "=== Setting up Pinggy TLS Tunnel for Docker Registry ==="

# Check if there's already a working Pinggy tunnel
echo "Checking for existing Pinggy tunnels..."
if curl -f --connect-timeout 5 --max-time 10 -u docker:k8mX9pL2nQ7vR4wE https://r1.teamxagents.com/v2/ >/dev/null 2>&1; then
    echo "✅ Existing Pinggy tunnel is already working for registry access"
    echo "🔒 Skipping TLS tunnel setup - using existing tunnel"
    exit 0
fi

# Stop any existing tunnels
pkill -f "a.pinggy.io" 2>/dev/null || true
pkill -f "pro.pinggy.io" 2>/dev/null || true

# Wait a moment for cleanup
sleep 2

echo "Starting TLS tunnel on port 80 (will terminate at your nginx)..."
echo "This tunnel will NOT inspect traffic - better for Docker registry"

# Start TLS tunnel - this will forward TLS traffic directly without inspection
# Your nginx will handle the SSL termination locally
# Using Pinggy Pro with custom domain r1.teamxagents.com and token FpyP2PGUXy0
echo "Attempting to start TLS tunnel with force option to override existing tunnel..."
nohup ssh -p 443 -R0:localhost:80 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 FpyP2PGUXy0@pro.pinggy.io force > /tmp/pinggy-tls.log 2>&1 &

PINGGY_PID=$!
echo "Pinggy TLS tunnel started with PID: $PINGGY_PID"

# Wait for tunnel to establish
echo "Waiting for TLS tunnel to establish..."
sleep 10

# Check if tunnel is running
if ps -p $PINGGY_PID > /dev/null; then
    echo "✅ TLS tunnel is running"

    # Extract the tunnel URL from logs
    sleep 5
    if [ -f /tmp/pinggy-tls.log ]; then
        echo "Tunnel information:"
        grep -E "(https://|tls://)" /tmp/pinggy-tls.log | head -5 || echo "Check /tmp/pinggy-tls.log for tunnel URL"
    fi
else
    echo "❌ TLS tunnel failed to start"
    cat /tmp/pinggy-tls.log
    exit 1
fi

echo "🔒 TLS tunnel active - Docker registry traffic will be end-to-end encrypted"
echo "📁 Tunnel logs: /tmp/pinggy-tls.log"
