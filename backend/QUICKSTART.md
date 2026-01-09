# 🚀 Quick Start Guide - 5 Minutes to Running Microservices

## Step 1: Start Docker Desktop

1. Open Docker Desktop application
2. Wait for it to say "Docker is running"

## Step 2: Start All Services

Open PowerShell/Terminal and run:

```bash
cd backend
docker-compose up --build
```

Wait 1-2 minutes for all services to start. You'll see:
```
✅ Connected to MongoDB
🚀 Auth service running on port 3001
🚀 Catalog service running on port 3002
🚀 Cart service running on port 3003
🚀 Checkout service running on port 3004
```

## Step 3: Test It Works

Open a new terminal and test:

```bash
# Test auth service
curl http://localhost:3001/health

# Register a test user
curl -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"Test1234\",\"firstName\":\"John\",\"lastName\":\"Doe\"}"
```

You should get a response with a token!

## Step 4: Start the Mobile App

In a new terminal:

```bash
npm install
npm start
```

Press `a` for Android, `i` for iOS, or `w` for web.

## Step 5: Use the App

1. Register a new account in the app
2. Browse products (you'll need to add some via API first)
3. Add items to cart
4. Checkout

## That's It! 🎉

Your microservices are now running:
- MongoDB: localhost:27017
- Auth: localhost:3001
- Catalog: localhost:3002
- Cart: localhost:3003
- Checkout: localhost:3004

## Add Test Data

```bash
# Add a test product
curl -X POST http://localhost:3002/api/products -H "Content-Type: application/json" -d "{\"name\":\"iPhone 15\",\"price\":999,\"description\":\"Latest iPhone\",\"category\":\"Electronics\", \"country\":\"USA\",\"store\":\"Apple Store\",\"providerId\":\"apple123\",\"stock\":50}"

# Add a test provider
curl -X POST http://localhost:3002/api/providers -H "Content-Type: application/json" -d "{\"name\":\"Apple Inc\",\"email\":\"contact@apple.com\",\"phone\":\"+1234567890\",\"address\":\"1 Apple Park Way\",\"country\":\"USA\",\"category\":\"Electronics\"}"
```

## Stop Everything

Press `Ctrl+C` in the terminal running docker-compose, then:

```bash
docker-compose down
```

## Next Steps

- Read the full [Backend README](README.md) for detailed documentation
- Learn about [Kubernetes deployment](README.md#kubernetes-deployment)
- Explore the [API endpoints](README.md#api-endpoints)

