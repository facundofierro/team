#!/bin/bash

set -e

echo "=== Setting up Pinggy Tunnel ==="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_MANAGER="$SCRIPT_DIR/manage-pinggy-service.sh"

# Install Pinggy CLI if not present
install_pinggy() {
    echo "Installing Pinggy CLI and systemd service..."
    chmod +x "$SERVICE_MANAGER"
    "$SERVICE_MANAGER" install
}

# Start Pinggy service
start_service() {
    echo "Starting Pinggy systemd service..."
    "$SERVICE_MANAGER" start
}

# Start Pinggy tunnel (legacy function, now uses systemd)
start_tunnel() {
    start_service
}

# Check if tunnel is running
check_tunnel() {
    "$SERVICE_MANAGER" check
}

# Restart tunnel if needed
restart_if_needed() {
    if ! "$SERVICE_MANAGER" check >/dev/null 2>&1; then
        echo "🔄 Pinggy service not running, restarting..."
        "$SERVICE_MANAGER" restart
    else
        echo "✅ Pinggy service is already running"
        "$SERVICE_MANAGER" logs
    fi
}

# Monitor tunnel stability
monitor_tunnel() {
    "$SERVICE_MANAGER" monitor
}

# Test external access
test_external_access() {
    "$SERVICE_MANAGER" test
}

# Export tunnel status
export_tunnel_status() {
    "$SERVICE_MANAGER" export-status
}

# Main execution based on command line argument
case "${1:-setup}" in
    "install")
        install_pinggy
        ;;
    "setup")
        install_pinggy
        start_service
        ;;
    "check")
        check_tunnel
        ;;
    "restart")
        restart_if_needed
        ;;
    "monitor")
        monitor_tunnel
        ;;
    "test")
        test_external_access
        ;;
    "status")
        export_tunnel_status
        ;;
    *)
        echo "Usage: $0 {install|setup|check|restart|monitor|test|status}"
        echo "  install - Install Pinggy CLI only"
        echo "  setup   - Full setup (install + create wrapper + start tunnel)"
        echo "  check   - Check if tunnel is running"
        echo "  restart - Restart tunnel if needed"
        echo "  monitor - Monitor tunnel stability"
        echo "  test    - Test external access"
        echo "  status  - Export tunnel status for GitHub Actions"
        exit 1
        ;;
esac
