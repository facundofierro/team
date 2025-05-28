#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_FILE="$SCRIPT_DIR/../systemd/pinggy.service"
SERVICE_NAME="pinggy"

echo "=== Pinggy Service Manager ==="

# Helper function to run sudo commands with password if available
run_sudo() {
    if [ -n "$SUDO_PASSWORD" ]; then
        echo "$SUDO_PASSWORD" | sudo -S "$@"
    else
        sudo "$@"
    fi
}

# Check SSH availability for TLS tunnel
check_ssh_available() {
    if ! command -v ssh &> /dev/null; then
        echo "❌ SSH is not available - required for TLS tunnel"
        echo "Please install openssh-client package"
        exit 1
    else
        echo "✅ SSH is available for TLS tunnel"
    fi
}

# Install systemd service
install_service() {
    echo "Installing Pinggy systemd service..."

    # Check SSH availability for TLS tunnel
    check_ssh_available

    # Check if old service exists and remove it first
    if systemctl list-unit-files | grep -q pinggy.service; then
        echo "🔄 Existing Pinggy service found - removing old configuration..."
        run_sudo systemctl stop $SERVICE_NAME 2>/dev/null || true
        run_sudo systemctl disable $SERVICE_NAME 2>/dev/null || true
        run_sudo rm -f /etc/systemd/system/$SERVICE_NAME.service
        run_sudo systemctl daemon-reload
        echo "✅ Old service configuration removed"
    fi

            # Get current user and group
    CURRENT_USER=$(whoami)
    CURRENT_GROUP=$(id -gn $CURRENT_USER)

    echo "Configuring service for user: $CURRENT_USER"
    echo "Primary group: $CURRENT_GROUP"

    # Create Pinggy working directory
    run_sudo mkdir -p /opt/pinggy
    run_sudo chown $CURRENT_USER:$CURRENT_GROUP /opt/pinggy
    run_sudo chmod 755 /opt/pinggy
    echo "✅ Created working directory: /opt/pinggy"

    # Create temporary service file with user-specific values
    TEMP_SERVICE_FILE="/tmp/pinggy.service"
    sed -e "s|__USER__|$CURRENT_USER|g" \
        -e "s|__GROUP__|$CURRENT_GROUP|g" \
        "$SERVICE_FILE" > "$TEMP_SERVICE_FILE"

    # Copy customized service file
    run_sudo cp "$TEMP_SERVICE_FILE" /etc/systemd/system/pinggy.service

    # Clean up temporary file
    rm -f "$TEMP_SERVICE_FILE"

    # Reload systemd
    run_sudo systemctl daemon-reload

    # Enable service to start on boot
    run_sudo systemctl enable $SERVICE_NAME

    echo "✅ Pinggy service installed and enabled"
}

# Start the service
start_service() {
    # Check if service is already running
    if run_sudo systemctl is-active --quiet $SERVICE_NAME; then
        echo "✅ Pinggy service is already running"
        show_status
        return 0
    fi

    echo "Starting Pinggy service..."

    # Stop any existing manual processes first
    pkill -f "tls@a.pinggy.io.*FpyP2PGUXy0" 2>/dev/null || true
    sleep 2

    run_sudo systemctl start $SERVICE_NAME

    # Wait a moment for service to start
    sleep 5

    if run_sudo systemctl is-active --quiet $SERVICE_NAME; then
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
    run_sudo systemctl stop $SERVICE_NAME
    echo "✅ Pinggy service stopped"
}

# Restart the service
restart_service() {
    echo "Restarting Pinggy service..."
    run_sudo systemctl restart $SERVICE_NAME

    # Wait a moment for service to restart
    sleep 5

    if run_sudo systemctl is-active --quiet $SERVICE_NAME; then
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
    run_sudo systemctl status $SERVICE_NAME --no-pager -l
}

# Show service logs
show_logs() {
    echo "Recent Pinggy service logs:"
    run_sudo journalctl -u $SERVICE_NAME --no-pager -l -n 20
}

# Follow service logs
follow_logs() {
    echo "Following Pinggy service logs (Ctrl+C to stop):"
    run_sudo journalctl -u $SERVICE_NAME -f
}

# Check if service is running
check_service() {
    if run_sudo systemctl is-active --quiet $SERVICE_NAME; then
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
    for i in {1..3}; do
        if run_sudo systemctl is-active --quiet $SERVICE_NAME; then
            echo "✅ Pinggy service still running (check $i/3)"
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
    if run_sudo systemctl is-active --quiet $SERVICE_NAME; then
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
    run_sudo systemctl stop $SERVICE_NAME 2>/dev/null || true
    run_sudo systemctl disable $SERVICE_NAME 2>/dev/null || true

    # Remove service file
    run_sudo rm -f /etc/systemd/system/$SERVICE_NAME.service

    # Remove working directory
    run_sudo rm -rf /opt/pinggy

    # Reload systemd
    run_sudo systemctl daemon-reload

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
