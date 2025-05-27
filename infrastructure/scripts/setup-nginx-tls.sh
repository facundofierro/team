#!/bin/bash

set -e

echo "=== Setting up Nginx with TLS for Docker Registry ==="

# Get the server's local IP
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "Detected server IP: $SERVER_IP"

# Create certificates directory
CERT_DIR="/opt/nginx-certs"
mkdir -p "$CERT_DIR"

# Generate self-signed certificate for local use
echo "Generating self-signed certificate..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$CERT_DIR/registry.key" \
    -out "$CERT_DIR/registry.crt" \
    -subj "/C=US/ST=Local/L=Local/O=TeamXAgents/OU=Registry/CN=$SERVER_IP" \
    -addext "subjectAltName=IP:$SERVER_IP,IP:127.0.0.1,DNS:localhost,DNS:r1.teamxagents.com"

echo "✅ Certificate generated"

# Create enhanced nginx configuration with TLS
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

echo "✅ Enhanced nginx configuration created"

# Update the docker-compose to mount certificates
echo "Updating docker-compose configuration..."

# Create a backup of the current docker-compose
cp infrastructure/docker-compose.yml infrastructure/docker-compose.yml.backup.$(date +%Y%m%d_%H%M%S)

# Update nginx service in docker-compose to include certificate volume
cat > /tmp/nginx-service-update.yml << EOF
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./configs/nginx-tls.conf:/etc/nginx/nginx.conf:ro
      - $CERT_DIR:/etc/nginx/certs:ro
    depends_on:
      - teamhub
      - registry
    networks:
      - team-network
EOF

echo "✅ Docker compose configuration prepared"
echo "Certificate files created in: $CERT_DIR"
echo "Enhanced nginx config created: /tmp/nginx-tls.conf"

echo ""
echo "To apply this configuration:"
echo "1. Copy the new nginx config: cp /tmp/nginx-tls.conf infrastructure/configs/nginx-tls.conf"
echo "2. Update your docker-compose.yml to use the new config and mount certificates"
echo "3. Restart the nginx container"
echo ""
echo "The registry will be available at:"
echo "  - HTTPS: https://$SERVER_IP/v2/"
echo "  - HTTPS: https://r1.teamxagents.com/v2/ (via Pinggy tunnel)"
