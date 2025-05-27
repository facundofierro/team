#!/bin/bash

set -e

echo "=== Preparing TLS Certificates for Future Use ==="

# Get the server's local IP
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "Detected server IP: $SERVER_IP"

# Create certificates directory
CERT_DIR="/opt/nginx-certs"

# Helper function to run sudo commands with password if available
run_sudo() {
    if [ -n "$SUDO_PASSWORD" ]; then
        echo "$SUDO_PASSWORD" | sudo -S "$@"
    else
        sudo "$@"
    fi
}

run_sudo mkdir -p "$CERT_DIR"

# Generate self-signed certificate for HTTPS support
echo "Generating self-signed certificate for HTTPS support..."
run_sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$CERT_DIR/nginx.key" \
    -out "$CERT_DIR/nginx.crt" \
    -subj "/C=US/ST=Local/L=Local/O=TeamXAgents/OU=Registry/CN=$SERVER_IP" \
    -addext "subjectAltName=IP:$SERVER_IP,IP:127.0.0.1,DNS:localhost,DNS:r1.teamxagents.com"

# Set proper permissions
run_sudo chmod 644 "$CERT_DIR/nginx.crt"
run_sudo chmod 600 "$CERT_DIR/nginx.key"

# Also create registry.crt and registry.key for backward compatibility
run_sudo cp "$CERT_DIR/nginx.crt" "$CERT_DIR/registry.crt"
run_sudo cp "$CERT_DIR/nginx.key" "$CERT_DIR/registry.key"

echo "✅ Certificate generated and ready for future use"

# Create enhanced nginx configuration with TLS (for future use)
echo "Creating TLS-enabled nginx configuration template..."
cat > /tmp/nginx-tls.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream teamhub {
        server teamhub:3000;
    }

    upstream registry {
        server registry:5000;
    }

    upstream remotion {
        server host.docker.internal:6000;
    }

    upstream nextcloud {
        server nextcloud:80;
    }

    # HTTP server (redirect to HTTPS for registry)
    server {
        listen 80;
        listen [::]:80;
        server_name _;

        # Redirect registry requests to HTTPS
        location /v2/ {
            return 301 https://$host$request_uri;
        }

        # Main application (can stay HTTP for internal use)
        location / {
            proxy_pass http://teamhub;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Remotion service
        location /remotion/ {
            proxy_pass http://remotion/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Nextcloud service
        location ^~ /nextcloud/ {
            rewrite ^/nextcloud/(.*) /$1 break;
            proxy_pass http://nextcloud;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Server $host;
            proxy_set_header X-Forwarded-Port $server_port;
            client_max_body_size 10G;
            proxy_buffering off;
            proxy_request_buffering off;
            proxy_set_header Destination $http_destination;
            proxy_redirect / /nextcloud/;
        }

        location ^~ /nextcloud {
            return 301 /nextcloud/;
        }
    }

    # HTTPS server for registry
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name _;

        # SSL configuration
        ssl_certificate /etc/nginx/certs/registry.crt;
        ssl_certificate_key /etc/nginx/certs/registry.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Docker registry (HTTPS only)
        location /v2/ {
            proxy_pass http://registry;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header Proxy "";
            proxy_buffering off;
            client_max_body_size 100M;
            proxy_request_buffering off;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_connect_timeout 300s;
            proxy_send_timeout 300s;
            proxy_read_timeout 300s;
            chunked_transfer_encoding on;
        }

        # Redirect other requests to HTTP
        location / {
            return 301 http://$host$request_uri;
        }
    }
}
EOF

echo "✅ TLS nginx configuration template created"

# Get the script directory and repository root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "Script directory: $SCRIPT_DIR"
echo "Repository root: $REPO_ROOT"

# Copy the nginx configuration to the configs directory for future use
echo "Saving TLS configuration template..."
cp /tmp/nginx-tls.conf "$REPO_ROOT/infrastructure/configs/nginx-tls.conf"

echo "✅ TLS setup completed"
echo ""
echo "Summary:"
echo "- TLS certificates generated at: $CERT_DIR"
echo "- TLS nginx config template saved at: infrastructure/configs/nginx-tls.conf"
echo "- Current deployment will use HTTP (insecure registry mode)"
echo "- TLS configuration is ready for future use when needed"
echo ""
echo "The registry will be accessible via HTTP through the Pinggy tunnel"
echo "Docker clients will need to be configured with insecure-registries setting"
