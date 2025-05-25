# Pinggy Multi-Port Setup Guide

## 🎯 **Your Configuration**

With your Pinggy Pro domain `ukjhwjyazp.a.pinggy.link`, you now have:

### **Port Mapping**

- **Main App**: `ukjhwjyazp.a.pinggy.link:443` → `192.168.88.135:3000`
- **Registry**: `ukjhwjyazp.a.pinggy.link:5000` → `192.168.88.135:5000`

### **Access URLs**

- **Main App**: `https://ukjhwjyazp.a.pinggy.link` (default HTTPS port 443)
- **Registry**: `https://ukjhwjyazp.a.pinggy.link:5000` (custom port 5000)

## 🔄 **How the Workflow Works**

### **1. setup-registry Job** (Self-hosted runner)

- ✅ Sets up registry volumes and authentication
- ✅ Deploys registry service locally
- ✅ Creates **two Pinggy tunnels**:
  - Main app tunnel: `-p 443 -R0:192.168.88.135:3000`
  - Registry tunnel: `-p 5000 -R0:192.168.88.135:5000`

### **2. build-and-push Job** (GitHub runner)

- ✅ Builds Docker image
- ✅ **Pushes to external registry** via `ukjhwjyazp.a.pinggy.link:5000`
- ✅ Uploads image as artifact for local deployment

### **3. deploy Job** (Self-hosted runner)

- ✅ Downloads image artifact
- ✅ **Pushes to local registry** via `localhost:5000`
- ✅ Deploys the updated stack

## 🌐 **External vs Local Access**

| Component              | Location | Registry Access                 | URL                 |
| ---------------------- | -------- | ------------------------------- | ------------------- |
| **GitHub Actions**     | External | `ukjhwjyazp.a.pinggy.link:5000` | External via Pinggy |
| **Self-hosted runner** | Local    | `localhost:5000`                | Local direct access |
| **Docker Stack**       | Local    | `localhost:5000`                | Local direct access |

## 🔧 **Pinggy Command Details**

### **Main App Tunnel**

```bash
docker run --net=host --name=pinggy-tunnel -d pinggy/pinggy \
  -p 443 -R0:192.168.88.135:3000 \
  -o StrictHostKeyChecking=no -o ServerAliveInterval=30 \
  FpyP2PGUXy0@pro.pinggy.io
```

### **Registry Tunnel**

```bash
docker run --net=host --name=pinggy-registry-tunnel -d pinggy/pinggy \
  -p 5000 -R0:192.168.88.135:5000 \
  -o StrictHostKeyChecking=no -o ServerAliveInterval=30 \
  FpyP2PGUXy0@pro.pinggy.io
```

## 🎯 **Key Benefits**

✅ **Dual Access**: External (GitHub) and local (self-hosted) registry access
✅ **Port Separation**: Main app (443) and registry (5000) don't conflict
✅ **Secure**: Registry authentication with username/password
✅ **Efficient**: Local operations use localhost, external uses Pinggy
✅ **Reliable**: Retry logic for external pushes

## 🧪 **Testing the Setup**

### **Test External Registry Access**

```bash
# From any external machine
docker login https://ukjhwjyazp.a.pinggy.link:5000
# Username: admin
# Password: k8mX9pL2nQ7vR4wE

docker pull hello-world
docker tag hello-world ukjhwjyazp.a.pinggy.link:5000/hello-world
docker push ukjhwjyazp.a.pinggy.link:5000/hello-world
```

### **Test Local Registry Access**

```bash
# From your server
docker login localhost:5000
# Username: admin
# Password: k8mX9pL2nQ7vR4wE

docker pull hello-world
docker tag hello-world localhost:5000/hello-world
docker push localhost:5000/hello-world
```

## 🔍 **Troubleshooting**

### **Check Tunnel Status**

```bash
docker ps --filter "name=pinggy" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### **Check Tunnel Logs**

```bash
docker logs pinggy-tunnel
docker logs pinggy-registry-tunnel
```

### **Test Registry Endpoints**

```bash
# Local
curl -u admin:k8mX9pL2nQ7vR4wE http://localhost:5000/v2/_catalog

# External
curl -u admin:k8mX9pL2nQ7vR4wE https://ukjhwjyazp.a.pinggy.link:5000/v2/_catalog
```

## 🚀 **Ready to Deploy!**

Your setup is now configured for:

- **GitHub Actions** → External registry access via Pinggy
- **Local operations** → Direct localhost access
- **Dual tunnels** → No port conflicts

Push a commit to test the complete workflow! 🎉
