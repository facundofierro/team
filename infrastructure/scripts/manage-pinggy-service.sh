#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_FILE="$SCRIPT_DIR/../systemd/pinggy.service"
SERVICE_NAME="pinggy"

echo "=== Pinggy Service Manager ==="

# Install Pinggy CLI if not present
install_pinggy_cli() {
    if ! command -v pinggy &> /dev/null; then
        echo "Installing Pinggy CLI..."
        curl -sSL -o /tmp/pinggy https://s3.ap-south-1.amazonaws.com/public.pinggy.binaries/cli/v0.2.2/linux/amd64/pinggy
        chmod +x /tmp/pinggy
        sudo mv /tmp/pinggy /usr/local/bin/
        echo "✅ Pinggy CLI installed"
    else
        echo "✅ Pinggy CLI already installed"
    fi
}

# Install systemd service
install_service() {
    echo "Installing Pinggy systemd service..."

    # Install Pinggy CLI first
    install_pinggy_cli

    # Copy service file
    sudo cp "$SERVICE_FILE" /etc/systemd/system/

    # Reload systemd
    sudo systemctl daemon-reload

    # Enable service to start on boot
    sudo systemctl enable $SERVICE_NAME

    echo "✅ Pinggy service installed and enabled"
}

# Start the service
start_service() {
    echo "Starting Pinggy service..."

    # Stop any existing manual processes first
    pkill -f "pinggy.*FpyP2PGUXy0" 2>/dev/null || true
    sleep 2

    sudo systemctl start $SERVICE_NAME

    # Wait a moment for service to start
    sleep 5

    if sudo systemctl is-active --quiet $SERVICE_NAME; then
        echo "✅ Pinggy service started successfully"
        show_status
    else
        echo "❌ Failed to start Pinggy service"
        show_logs
        exit 1
    fi
}

# Stop the service
stop_service() {
    echo "Stopping Pinggy service..."
    sudo systemctl stop $SERVICE_NAME
    echo "✅ Pinggy service stopped"
}

# Restart the service
restart_service() {
    echo "Restarting Pinggy service..."
    sudo systemctl restart $SERVICE_NAME

    # Wait a moment for service to restart
    sleep 5

    if sudo systemctl is-active --quiet $SERVICE_NAME; then
        echo "✅ Pinggy service restarted successfully"
        show_status
    else
        echo "❌ Failed to restart Pinggy service"
        show_logs
        exit 1
    fi
}

# Show service status
show_status() {
    echo "Pinggy service status:"
    sudo systemctl status $SERVICE_NAME --no-pager -l
}

# Show service logs
show_logs() {
    echo "Recent Pinggy service logs:"
    sudo journalctl -u $SERVICE_NAME --no-pager -l -n 20
}

# Follow service logs
follow_logs() {
    echo "Following Pinggy service logs (Ctrl+C to stop):"
    sudo journalctl -u $SERVICE_NAME -f
}

# Check if service is running
check_service() {
    if sudo systemctl is-active --quiet $SERVICE_NAME; then
        echo "✅ Pinggy service is running"
        return 0
    else
        echo "❌ Pinggy service is not running"
        return 1
    fi
}

# Test external access through tunnel
test_external_access() {
    echo "Testing external registry access via Pinggy tunnel..."

    # Wait a bit for tunnel to stabilize
    sleep 10

    # Test with HTTPS (since Pinggy exposes port 443)
    if curl -f --connect-timeout 10 --max-time 30 -u docker:k8mX9pL2nQ7vR4wE https://r1.teamxagents.com/v2/ >/dev/null 2>&1; then
        echo "✅ Registry accessible via HTTPS through tunnel"
        return 0
    else
        echo "⚠️ Registry not accessible via HTTPS, checking service status..."
        show_status
        echo "Recent logs:"
        show_logs
        return 1
    fi
}

# Monitor service for a period
monitor_service() {
    echo "Monitoring Pinggy service for 30 seconds..."
    for i in {1..6}; do
        if sudo systemctl is-active --quiet $SERVICE_NAME; then
            echo "✅ Pinggy service still running (check $i/6)"
        else
            echo "❌ Pinggy service has failed! Checking logs..."
            show_logs
            exit 1
        fi
        sleep 5
    done
    echo "✅ Service monitoring completed successfully"
}

# Export service status for GitHub Actions
export_service_status() {
    if sudo systemctl is-active --quiet $SERVICE_NAME; then
        # Test if tunnel is working
        if curl -f --connect-timeout 5 --max-time 10 -u docker:k8mX9pL2nQ7vR4wE https://r1.teamxagents.com/v2/ >/dev/null 2>&1; then
            echo "tunnel_ready=true" >> $GITHUB_OUTPUT
            echo "✅ Pinggy service is ready for external access"
            return 0
        else
            echo "tunnel_ready=false" >> $GITHUB_OUTPUT
            echo "❌ Pinggy service is running but tunnel is not ready"
            show_logs
            return 1
        fi
    else
        echo "tunnel_ready=false" >> $GITHUB_OUTPUT
        echo "❌ Pinggy service is not running"
        show_logs
        return 1
    fi
}

# Uninstall service
uninstall_service() {
    echo "Uninstalling Pinggy service..."

    # Stop and disable service
    sudo systemctl stop $SERVICE_NAME 2>/dev/null || true
    sudo systemctl disable $SERVICE_NAME 2>/dev/null || true

    # Remove service file
    sudo rm -f /etc/systemd/system/$SERVICE_NAME.service

    # Reload systemd
    sudo systemctl daemon-reload

    echo "✅ Pinggy service uninstalled"
}

# Main execution based on command line argument
case "${1:-status}" in
    "install")
        install_service
        ;;
    "start")
        start_service
        ;;
    "stop")
        stop_service
        ;;
    "restart")
        restart_service
        ;;
    "status")
        show_status
        ;;
    "check")
        check_service
        ;;
    "logs")
        show_logs
        ;;
    "follow")
        follow_logs
        ;;
    "test")
        test_external_access
        ;;
    "monitor")
        monitor_service
        ;;
    "export-status")
        export_service_status
        ;;
    "uninstall")
        uninstall_service
        ;;
    *)
        echo "Usage: $0 {install|start|stop|restart|status|check|logs|follow|test|monitor|export-status|uninstall}"
        echo ""
        echo "Commands:"
        echo "  install       - Install and enable Pinggy systemd service"
        echo "  start         - Start the Pinggy service"
        echo "  stop          - Stop the Pinggy service"
        echo "  restart       - Restart the Pinggy service"
        echo "  status        - Show detailed service status"
        echo "  check         - Quick check if service is running"
        echo "  logs          - Show recent service logs"
        echo "  follow        - Follow service logs in real-time"
        echo "  test          - Test external access through tunnel"
        echo "  monitor       - Monitor service stability for 30 seconds"
        echo "  export-status - Export tunnel status for GitHub Actions"
        echo "  uninstall     - Remove the systemd service"
        exit 1
        ;;
esac
