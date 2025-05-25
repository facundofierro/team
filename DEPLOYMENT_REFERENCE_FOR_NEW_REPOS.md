# 🚀 Deployment Reference for New Repositories

## 📋 **Server Infrastructure Overview**

This document contains all the information needed to deploy new services to our existing server infrastructure with shared Docker registry and Pinggy tunnels.

### **🏠 Server Details**

- **Server IP**: `192.168.88.135`
- **Docker Mode**: Docker Swarm
- **Self-hosted Runner**: Already configured and running as service
- **Pinggy Connection**: `FpyP2PGUXy0@pro.pinggy.io`
- **Pinggy Domain**: `ukjhwjyazp.a.pinggy.link`

## 🐳 **Docker Registry Configuration**

### **Registry Details**

- **Local Access**: `localhost:5000`
- **External Access**: `https://ukjhwjyazp.a.pinggy.link:5000`
- **Username**: `admin`
- **Password**: `k8mX9pL2nQ7vR4wE`

### **Registry Usage in Docker Stack**

```yaml
services:
  your-new-service:
    image: localhost:5000/your-service-name:latest
    # ... other configuration
```

## 🌐 **Port Allocation**

### **Currently Used Ports**

- **3000**: TeamHub application
- **5000**: Docker Registry
- **443**: Pinggy tunnel for TeamHub (external)

### **Available Ports for New Services**

- **4000**: Recommended for Remotion service
- **6000-9000**: Available for additional services
- **8080, 8443**: Common alternatives for Pinggy tunnels

### **Pinggy Port Mapping Pattern**

```bash
# Main app example (TeamHub)
-p 443 -R0:192.168.88.135:3000

# Registry example
-p 5000 -R0:192.168.88.135:5000

# New service example (Remotion on port 4000)
-p 8080 -R0:192.168.88.135:4000
```

## 📁 **Required Files for New Repository**

### **1. docker-stack.yml Template**

```yaml
version: '3.8'
services:
  # Your new service (e.g., remotion-service)
  your-service-name:
    image: localhost:5000/your-service-name:latest
    deploy:
      replicas: 1
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
      rollback_config:
        parallelism: 1
        delay: 10s
    ports:
      - '4000:3000' # Adjust ports as needed
    environment:
      - NODE_ENV=production
      # Add your environment variables here
    networks:
      - app_network
    # Optional: Connect to existing registry network
    # networks:
    #   - registry_network

networks:
  app_network:
    driver: overlay
  # Optional: Use existing registry network
  # registry_network:
  #   external: true
  #   name: teamhub_registry_network

# Add volumes if needed
volumes:
  your_service_data:
```

### **2. GitHub Actions Workflow Template**

```yaml
name: Deploy Your Service to Self-Hosted Server

on:
  push:
    branches:
      - main

jobs:
  prepare-tag:
    runs-on: ubuntu-latest
    outputs:
      tag: ${{ steps.set_tag.outputs.tag }}
    steps:
      - name: Set commit SHA as output
        id: set_tag
        run: echo "tag=${GITHUB_SHA}" >> $GITHUB_OUTPUT

  setup-tunnels:
    runs-on: self-hosted
    needs: prepare-tag
    steps:
      - name: Ensure Pinggy tunnel for new service
        run: |
          # Check if tunnel for this service exists
          if ! docker ps --filter "name=pinggy-your-service-tunnel" --filter "status=running" | grep pinggy-your-service-tunnel; then
            docker rm -f pinggy-your-service-tunnel || true
            # Create tunnel: external port 8080 -> internal port 4000
            docker run --net=host --name=pinggy-your-service-tunnel -d pinggy/pinggy \
              -p 8080 -R0:192.168.88.135:4000 \
              -o StrictHostKeyChecking=no -o ServerAliveInterval=30 \
              FpyP2PGUXy0@pro.pinggy.io
            echo "Waiting for tunnel to be ready..."
            sleep 15
          else
            echo "Pinggy tunnel for your service is already running."
          fi

  build-and-push:
    runs-on: ubuntu-latest
    needs: [prepare-tag, setup-tunnels]
    outputs:
      tag: ${{ needs.prepare-tag.outputs.tag }}
    env:
      REGISTRY_DOMAIN: 'ukjhwjyazp.a.pinggy.link:5000'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: Dockerfile # Adjust path as needed
          push: false
          tags: |
            your-service-name:latest
            your-service-name:${{ needs.prepare-tag.outputs.tag }}
          outputs: type=docker,dest=/tmp/your-service-name.tar

      - name: Upload Docker image artifact
        uses: actions/upload-artifact@v4
        with:
          name: your-service-image
          path: /tmp/your-service-name.tar
          retention-days: 1

      - name: Login to external registry via Pinggy
        run: |
          echo "Logging in to registry at https://$REGISTRY_DOMAIN"
          echo "k8mX9pL2nQ7vR4wE" | docker login https://$REGISTRY_DOMAIN -u admin --password-stdin

      - name: Load and push image to external registry
        run: |
          docker load -i /tmp/your-service-name.tar

          docker tag your-service-name:${{ needs.prepare-tag.outputs.tag }} $REGISTRY_DOMAIN/your-service-name:${{ needs.prepare-tag.outputs.tag }}
          docker tag your-service-name:latest $REGISTRY_DOMAIN/your-service-name:latest

          for i in {1..3}; do
            echo "Pushing images to external registry (attempt $i/3)..."
            if docker push $REGISTRY_DOMAIN/your-service-name:${{ needs.prepare-tag.outputs.tag }} && docker push $REGISTRY_DOMAIN/your-service-name:latest; then
              echo "Successfully pushed images to external registry"
              break
            else
              echo "Push failed, retrying in 10 seconds..."
              sleep 10
              if [ $i -eq 3 ]; then
                echo "Failed to push after 3 attempts"
                exit 1
              fi
            fi
          done

  deploy:
    runs-on: self-hosted
    needs: build-and-push
    steps:
      - name: Checkout docker-stack.yml
        uses: actions/checkout@v4
        with:
          sparse-checkout: |
            docker-stack.yml
          sparse-checkout-cone-mode: false

      - name: Download Docker image artifact
        uses: actions/download-artifact@v4
        with:
          name: your-service-image
          path: /tmp

      - name: Load Docker image
        run: docker load -i /tmp/your-service-name.tar

      - name: Login to local registry
        run: |
          echo "Logging in to local registry at localhost:5000"
          echo "k8mX9pL2nQ7vR4wE" | docker login localhost:5000 -u admin --password-stdin

      - name: Tag and push to local registry
        run: |
          docker tag your-service-name:${{ needs.build-and-push.outputs.tag }} localhost:5000/your-service-name:${{ needs.build-and-push.outputs.tag }}
          docker tag your-service-name:latest localhost:5000/your-service-name:latest

          for i in {1..3}; do
            echo "Pushing images to registry (attempt $i/3)..."
            if docker push localhost:5000/your-service-name:${{ needs.build-and-push.outputs.tag }} && docker push localhost:5000/your-service-name:latest; then
              echo "Successfully pushed images to registry"
              break
            else
              echo "Push failed, retrying in 10 seconds..."
              sleep 10
              if [ $i -eq 3 ]; then
                echo "Failed to push after 3 attempts"
                exit 1
              fi
            fi
          done

      - name: Update docker-stack.yml with new image tag
        run: |
          sed -i "s|localhost:5000/your-service-name:.*|localhost:5000/your-service-name:${{ needs.build-and-push.outputs.tag }}|" docker-stack.yml

      - name: Deploy Docker stack
        run: |
          # Add any environment variables your service needs
          # export YOUR_ENV_VAR="${{ secrets.YOUR_ENV_VAR }}"
          docker stack deploy -c docker-stack.yml your-stack-name

      - name: Prune stopped containers
        run: docker container prune -f
```

## 🎯 **Remotion-Specific Configuration**

### **Recommended Setup for Remotion Service**

```yaml
# docker-stack.yml for Remotion
version: '3.8'
services:
  remotion-service:
    image: localhost:5000/remotion-service:latest
    deploy:
      replicas: 1
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
    ports:
      - '4000:3000' # Remotion service on port 4000
    environment:
      - NODE_ENV=production
      - REMOTION_CONCURRENCY=2
      # Add other Remotion-specific env vars
    volumes:
      - remotion_cache:/app/cache
      - remotion_output:/app/output
    networks:
      - remotion_network

volumes:
  remotion_cache:
  remotion_output:

networks:
  remotion_network:
    driver: overlay
```

### **Pinggy Tunnel for Remotion**

```bash
# External access: ukjhwjyazp.a.pinggy.link:8080 -> 192.168.88.135:4000
docker run --net=host --name=pinggy-remotion-tunnel -d pinggy/pinggy \
  -p 8080 -R0:192.168.88.135:4000 \
  -o StrictHostKeyChecking=no -o ServerAliveInterval=30 \
  FpyP2PGUXy0@pro.pinggy.io
```

## 🔧 **Customization Checklist**

When setting up a new service, replace these placeholders:

### **In docker-stack.yml:**

- [ ] `your-service-name` → `remotion-service`
- [ ] `your-stack-name` → `remotion`
- [ ] Port `4000:3000` → Adjust as needed
- [ ] Add service-specific environment variables
- [ ] Add required volumes

### **In GitHub Actions:**

- [ ] `your-service-name` → `remotion-service`
- [ ] `your-service-image` → `remotion-service-image`
- [ ] `your-stack-name` → `remotion`
- [ ] `pinggy-your-service-tunnel` → `pinggy-remotion-tunnel`
- [ ] Dockerfile path
- [ ] Port numbers (4000, 8080)

### **Environment Variables:**

- [ ] Add any secrets needed in GitHub repo settings
- [ ] Update environment section in docker-stack.yml
- [ ] Add export commands in deploy step if needed

## 🌐 **Access URLs After Deployment**

- **Local**: `http://192.168.88.135:4000`
- **External**: `https://ukjhwjyazp.a.pinggy.link:8080`

## 🔍 **Testing Commands**

```bash
# Check if service is running
docker service ls | grep remotion

# Check service logs
docker service logs remotion_remotion-service

# Check Pinggy tunnel
docker ps | grep pinggy-remotion-tunnel

# Test external access
curl https://ukjhwjyazp.a.pinggy.link:8080/health

# Test registry access
curl -u admin:k8mX9pL2nQ7vR4wE https://ukjhwjyazp.a.pinggy.link:5000/v2/_catalog
```

## 🚀 **Quick Start Steps**

1. **Copy this file** to your new repository root
2. **Create docker-stack.yml** using the template above
3. **Create .github/workflows/deploy.yml** using the template above
4. **Customize** service names, ports, and environment variables
5. **Add GitHub secrets** if needed
6. **Push to main branch** to trigger deployment

## 📞 **Support Information**

- **Registry Password**: `k8mX9pL2nQ7vR4wE`
- **Pinggy Connection**: `FpyP2PGUXy0@pro.pinggy.io`
- **Server IP**: `192.168.88.135`
- **Self-hosted Runner**: Already configured for multiple repos

---

**🎉 Ready to deploy your new service!** Follow the customization checklist and you'll have your Remotion service running alongside the existing infrastructure.
