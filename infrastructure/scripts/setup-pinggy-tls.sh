#!/bin/bash

set -e

echo "=== Setting up Pinggy TLS Tunnel for Docker Registry ==="

# Stop any existing HTTP tunnel
pkill -f "a.pinggy.io" 2>/dev/null || true

# Wait a moment for cleanup
sleep 2

echo "Starting TLS tunnel on port 80 (will terminate at your nginx)..."
echo "This tunnel will NOT inspect traffic - better for Docker registry"

# Start TLS tunnel - this will forward TLS traffic directly without inspection
# Your nginx will handle the SSL termination locally
nohup ssh -p 443 -R0:localhost:80 -o ServerAliveInterval=30 -o ServerAliveCountMax=3 tls@a.pinggy.io > /tmp/pinggy-tls.log 2>&1 &

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
