# Pinggy Systemd Service

This directory contains the systemd service configuration for running Pinggy CLI as a system service, providing better reliability and management compared to manual process handling.

## 🎯 **Benefits of Systemd Service**

- **Automatic startup**: Service starts on system boot
- **Auto-restart**: Automatic restart on failure with configurable limits
- **Better logging**: Centralized logging via journalctl
- **Process management**: Proper signal handling and cleanup
- **Resource limits**: Memory and file descriptor limits
- **Security**: Runs with restricted permissions
- **Monitoring**: Easy status checking and health monitoring

## 📁 **Files**

- `pinggy.service` - Systemd service unit file
- `README.md` - This documentation

## 🚀 **Quick Start**

### Install and Start Service

```bash
# Install the service
./infrastructure/scripts/manage-pinggy-service.sh install

# Start the service
./infrastructure/scripts/manage-pinggy-service.sh start

# Check status
./infrastructure/scripts/manage-pinggy-service.sh status
```

### Using the Legacy Setup Script

The existing setup script now uses the systemd service:

```bash
# This now installs and starts the systemd service
./infrastructure/scripts/setup-pinggy.sh setup
```

## 🔧 **Service Management**

### Basic Commands

```bash
# Service management script
./infrastructure/scripts/manage-pinggy-service.sh [command]

# Available commands:
install       # Install and enable systemd service
start         # Start the service
stop          # Stop the service
restart       # Restart the service
status        # Show detailed service status
check         # Quick check if service is running
logs          # Show recent service logs
follow        # Follow service logs in real-time
test          # Test external access through tunnel
monitor       # Monitor service stability for 30 seconds
export-status # Export tunnel status for GitHub Actions
uninstall     # Remove the systemd service
```

### Direct Systemctl Commands

```bash
# Start service
sudo systemctl start pinggy

# Stop service
sudo systemctl stop pinggy

# Restart service
sudo systemctl restart pinggy

# Check status
sudo systemctl status pinggy

# Enable auto-start on boot
sudo systemctl enable pinggy

# Disable auto-start
sudo systemctl disable pinggy

# View logs
sudo journalctl -u pinggy -f
```

## 📊 **Monitoring and Logs**

### View Service Status

```bash
# Detailed status
sudo systemctl status pinggy

# Quick check
systemctl is-active pinggy
```

### View Logs

```bash
# Recent logs
sudo journalctl -u pinggy -n 50

# Follow logs in real-time
sudo journalctl -u pinggy -f

# Logs since boot
sudo journalctl -u pinggy -b

# Logs for specific time period
sudo journalctl -u pinggy --since "1 hour ago"
```

## ⚙️ **Service Configuration**

### Service File Location

- **Source**: `infrastructure/systemd/pinggy.service`
- **Installed**: `/etc/systemd/system/pinggy.service`

### Key Configuration Options

```ini
[Unit]
Description=Pinggy Tunnel Service
After=network-online.target          # Wait for network
StartLimitIntervalSec=0             # No limit on restart attempts

[Service]
Type=simple                         # Simple service type
User=runner                         # Run as runner user
ExecStart=/usr/bin/ssh ... # SSH command for TLS tunnel
Restart=always                      # Always restart on failure
RestartSec=10                       # Wait 10 seconds before restart
StandardOutput=journal              # Log to systemd journal
MemoryMax=512M                      # Memory limit
StartLimitBurst=5                   # Max 5 restart attempts
StartLimitIntervalSec=300           # In 5 minute window

[Install]
WantedBy=multi-user.target          # Start in multi-user mode
```

### Security Features

- **NoNewPrivileges**: Prevents privilege escalation
- **PrivateTmp**: Private /tmp directory
- **ProtectSystem**: Read-only system directories
- **ProtectHome**: Restricted home directory access

## 🔄 **GitHub Actions Integration**

The GitHub Actions workflow automatically:

1. **Installs** the systemd service if not present
2. **Starts** the service before deployment
3. **Monitors** service health during deployment
4. **Tests** external connectivity through the tunnel
5. **Exports** tunnel status for subsequent jobs

### Workflow Steps

```yaml
- name: Setup Pinggy systemd service
  run: |
    chmod +x infrastructure/scripts/setup-pinggy.sh
    chmod +x infrastructure/scripts/manage-pinggy-service.sh
    infrastructure/scripts/setup-pinggy.sh setup

- name: Ensure Pinggy service is running
  run: infrastructure/scripts/setup-pinggy.sh restart

- name: Monitor service stability
  run: infrastructure/scripts/setup-pinggy.sh monitor

- name: Test external registry access
  run: infrastructure/scripts/setup-pinggy.sh test
```

## 🛠️ **Troubleshooting**

### Service Won't Start

```bash
# Check service status
sudo systemctl status pinggy

# Check logs for errors
sudo journalctl -u pinggy -n 50

# Check if Pinggy CLI is installed
which pinggy

# Test Pinggy CLI manually (TLS tunnel)
ssh -p 443 -R0:localhost:80 -o StrictHostKeyChecking=no tls@a.pinggy.io FpyP2PGUXy0
```

### Service Keeps Restarting

```bash
# Check restart count
sudo systemctl show pinggy | grep NRestarts

# Check logs for failure reasons
sudo journalctl -u pinggy --since "1 hour ago"

# Check system resources
free -h
df -h
```

### Network Connectivity Issues

```bash
# Test external access
curl -f --connect-timeout 10 -u docker:k8mX9pL2nQ7vR4wE https://r1.teamxagents.com/v2/

# Check local registry
curl -f -u docker:k8mX9pL2nQ7vR4wE http://127.0.0.1:80/v2/

# Check network connectivity
ping google.com
```

### Permission Issues

```bash
# Check service user
sudo systemctl show pinggy | grep User

# Check SSH availability
which ssh

# Check service file permissions
ls -la /etc/systemd/system/pinggy.service
```

## 🔄 **Migration from Manual Process**

If you were previously using the manual wrapper script approach:

1. **Stop old processes**:

   ```bash
   pkill -f "pinggy.*FpyP2PGUXy0"
   ```

2. **Install systemd service**:

   ```bash
   ./infrastructure/scripts/manage-pinggy-service.sh install
   ```

3. **Start service**:

   ```bash
   ./infrastructure/scripts/manage-pinggy-service.sh start
   ```

4. **Verify operation**:
   ```bash
   ./infrastructure/scripts/manage-pinggy-service.sh test
   ```

## 📈 **Performance and Reliability**

### Restart Policy

- **Automatic restart** on any failure
- **10-second delay** between restart attempts
- **Maximum 5 restarts** in 5-minute window
- **Exponential backoff** handled by systemd

### Resource Limits

- **Memory limit**: 512MB
- **File descriptors**: 65536
- **Private temp directory** for security

### Logging

- **Structured logging** via systemd journal
- **Log rotation** handled automatically
- **Persistent logs** across reboots
- **Easy filtering** by service name

## 🎯 **Best Practices**

1. **Always use the service management script** for operations
2. **Monitor logs regularly** for any issues
3. **Test connectivity** after any changes
4. **Keep service file in version control**
5. **Document any custom modifications**

---

**🎉 Your Pinggy tunnel is now running as a proper system service!**

For any issues, check the logs first: `sudo journalctl -u pinggy -f`
