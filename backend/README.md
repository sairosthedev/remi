# Remi Backend - Microservices Architecture

This backend consists of 4 microservices built with Node.js, Express, TypeScript, and MongoDB.

## 🏗️ Architecture

```
├── auth-service (Port 3001)      - User authentication & authorization
├── catalog-service (Port 3002)   - Products & providers management
├── cart-service (Port 3003)      - Shopping cart operations
├── checkout-service (Port 3004)  - Order processing & checkout
└── shared/                       - Common utilities & types
```

## 📋 Prerequisites

- **Docker Desktop** (with Kubernetes enabled) or **kind**
- **Node.js** 20+ (for local development)
- **kubectl** (for Kubernetes deployment)
- **Git**

## 🚀 Quick Start with Docker Compose

### 1. Build and run all services

```bash
cd backend
docker-compose up --build
```

This will start:
- MongoDB on port 27017
- auth-service on port 3001
- catalog-service on port 3002
- cart-service on port 3003
- checkout-service on port 3004

### 2. Test the services

```bash
# Health checks
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health

# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 3. Stop services

```bash
docker-compose down
```

## ☸️ Kubernetes Deployment

### Option 1: Docker Desktop Kubernetes

1. **Enable Kubernetes in Docker Desktop**
   - Open Docker Desktop Settings
   - Go to Kubernetes tab
   - Check "Enable Kubernetes"
   - Click "Apply & Restart"

2. **Verify kubectl is configured**
   ```bash
   kubectl cluster-info
   kubectl get nodes
   ```

3. **Build Docker images**
   ```bash
   cd backend

   # Build all service images
   docker build -t remi/auth-service:latest ./auth-service
   docker build -t remi/catalog-service:latest ./catalog-service
   docker build -t remi/cart-service:latest ./cart-service
   docker build -t remi/checkout-service:latest ./checkout-service
   ```

4. **Deploy to Kubernetes**
   ```bash
   # Create namespace and secrets
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/secrets.yaml

   # Deploy MongoDB
   kubectl apply -f k8s/mongodb-deployment.yaml

   # Wait for MongoDB to be ready
   kubectl wait --for=condition=ready pod -l app=mongo -n remi --timeout=120s

   # Deploy services
   kubectl apply -f k8s/auth-service-deployment.yaml
   kubectl apply -f k8s/catalog-service-deployment.yaml
   kubectl apply -f k8s/cart-service-deployment.yaml
   kubectl apply -f k8s/checkout-service-deployment.yaml
   ```

5. **Check deployment status**
   ```bash
   kubectl get all -n remi
   kubectl get pods -n remi
   kubectl logs -f deployment/auth-service -n remi
   ```

6. **Access services (port-forwarding)**
   ```bash
   # In separate terminals:
   kubectl port-forward -n remi svc/auth-service 3001:80
   kubectl port-forward -n remi svc/catalog-service 3002:80
   kubectl port-forward -n remi svc/cart-service 3003:80
   kubectl port-forward -n remi svc/checkout-service 3004:80
   ```

### Option 2: kind (Kubernetes in Docker)

1. **Install kind**
   ```bash
   # Windows (with Chocolatey)
   choco install kind

   # Or download from https://kind.sigs.k8s.io/docs/user/quick-start/
   ```

2. **Create cluster**
   ```bash
   kind create cluster --name remi
   kubectl cluster-info --context kind-remi
   ```

3. **Load images into kind**
   ```bash
   kind load docker-image remi/auth-service:latest --name remi
   kind load docker-image remi/catalog-service:latest --name remi
   kind load docker-image remi/cart-service:latest --name remi
   kind load docker-image remi/checkout-service:latest --name remi
   ```

4. **Deploy (same as Docker Desktop)**
   ```bash
   kubectl apply -f k8s/
   ```

## 🛠️ Local Development (without Docker)

### 1. Install dependencies for each service

```bash
cd auth-service && npm install
cd ../catalog-service && npm install
cd ../cart-service && npm install
cd ../checkout-service && npm install
```

### 2. Start MongoDB locally

```bash
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:7
```

### 3. Create .env files (copy from .env.example)

For each service, create a `.env` file with local MongoDB connection.

### 4. Run services in dev mode

```bash
# In separate terminals:
cd auth-service && npm run dev
cd catalog-service && npm run dev
cd cart-service && npm run dev
cd checkout-service && npm run dev
```

## 📡 API Endpoints

### Auth Service (3001)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify email with code
- `POST /api/auth/resend-verification` - Resend verification code
- `GET /api/auth/me` - Get current user (requires auth)

### Catalog Service (3002)
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/providers` - Get all providers
- `GET /api/providers/:id` - Get provider by ID
- `POST /api/providers` - Create provider

### Cart Service (3003) - Requires Auth
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:productId` - Update item quantity
- `DELETE /api/cart/items/:productId` - Remove item
- `DELETE /api/cart` - Clear cart

### Checkout Service (3004) - Requires Auth
- `POST /api/orders` - Create order (checkout)
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders/:id/cancel` - Cancel order

## 🔐 Authentication

Services use JWT (JSON Web Tokens) for authentication. Include the token in requests:

```bash
Authorization: Bearer <token>
```

## 📊 Monitoring & Debugging

### View logs (Docker Compose)
```bash
docker-compose logs -f
docker-compose logs -f auth-service
```

### View logs (Kubernetes)
```bash
kubectl logs -f deployment/auth-service -n remi
kubectl logs -f deployment/catalog-service -n remi
kubectl logs -f deployment/cart-service -n remi
kubectl logs -f deployment/checkout-service -n remi
```

### Access MongoDB (Docker Compose)
```bash
docker-compose exec mongo mongosh -u admin -p password123
```

### Access MongoDB (Kubernetes)
```bash
kubectl exec -it -n remi deployment/mongo -- mongosh -u admin -p password123
```

## 🧹 Cleanup

### Docker Compose
```bash
docker-compose down -v  # -v removes volumes
```

### Kubernetes
```bash
kubectl delete namespace remi
```

### kind
```bash
kind delete cluster --name remi
```

## 🔧 Configuration

### Environment Variables

Each service can be configured via environment variables:

- `PORT` - Service port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `NODE_ENV` - Environment (development/production)

### Kubernetes Secrets

Update secrets in `k8s/secrets.yaml` before deploying to production:

```bash
# Generate a secure JWT secret
openssl rand -base64 32
```

## 📦 Scaling

### Docker Compose
```bash
docker-compose up --scale catalog-service=3
```

### Kubernetes
```bash
kubectl scale deployment catalog-service --replicas=5 -n remi
```

## 🚢 Production Considerations

1. **Change default passwords** in secrets
2. **Use proper image registry** (Docker Hub, ECR, GCR)
3. **Add Ingress** for external access
4. **Enable TLS/SSL** for secure communication
5. **Add monitoring** (Prometheus, Grafana)
6. **Implement rate limiting**
7. **Add API Gateway** (Kong, Nginx, Traefik)
8. **Configure resource limits** properly
9. **Set up CI/CD** pipeline
10. **Enable backups** for MongoDB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT

