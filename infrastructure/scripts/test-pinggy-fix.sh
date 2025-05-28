#!/bin/bash

set -e

echo "=== Testing Pinggy Service Fix ==="

# Reinstall the service with the fixed configuration
echo "🔄 Reinstalling Pinggy service with fixed SSH command..."

# Stop and remove current service
sudo systemctl stop pinggy || true
sudo systemctl disable pinggy || true
sudo rm -f /etc/systemd/system/pinggy.service

# Reload systemd
sudo systemctl daemon-reload

# Install the fixed service
./infrastructure/scripts/manage-pinggy-service.sh install

# Start the service
echo "🚀 Starting fixed Pinggy service..."
./infrastructure/scripts/manage-pinggy-service.sh start

# Wait for service to stabilize
echo "⏳ Waiting for service to stabilize..."
sleep 15

# Test the service
echo "🧪 Testing service..."
if ./infrastructure/scripts/manage-pinggy-service.sh test; then
    echo "✅ Pinggy service is working correctly!"
    echo "🔗 SSH tunnel established successfully"
else
    echo "❌ Service test failed. Checking logs..."
    sudo systemctl status pinggy --no-pager -l
    echo "Recent logs:"
    sudo journalctl -u pinggy -n 10 --no-pager
fi

echo "=== Test completed ==="
