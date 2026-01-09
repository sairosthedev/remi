# Check Email Service Status

Your command ran without errors, which means Docker is working! But there are no email logs yet. Let's check and start the services.

## Step-by-Step Check

### 1. Check if services are running

```powershell
docker-compose ps
```

If no services are running, you'll need to start them.

### 2. Start services (if not running)

```powershell
cd C:\Users\macdo\Documents\GitHub\remi\backend
docker-compose up -d
```

This will start all services in the background.

### 3. Check if auth-service is running

```powershell
docker-compose ps | Select-String -Pattern "auth-service"
```

### 4. View all auth-service logs (not just email)

```powershell
docker-compose logs auth-service
```

Look for:
- `✅ Connected to MongoDB`
- `🚀 Auth service running on port 3001`
- `✅ Email service initialized` or `📧 Email service initialized`

### 5. Check specifically for email service initialization

```powershell
docker-compose logs auth-service | Select-String -Pattern "Email|email|SMTP|smtp"
```

### 6. Rebuild and restart (if email service code is new)

Since you just added the email service, you might need to rebuild:

```powershell
# Stop services
docker-compose down

# Rebuild the auth-service with new code
docker-compose build auth-service

# Start services again
docker-compose up -d

# Check logs
docker-compose logs auth-service | Select-String -Pattern "Email|email"
```

## Expected Output

### If email service is configured correctly:

You should see:
```
✅ Email service initialized with SMTP (smtp.gmail.com:587)
```

OR if using console mode:
```
📧 Email service initialized in console mode
```

### If email is NOT configured:

You might see:
```
⚠️  No valid email configuration found. Using console mode.
```

## Quick Status Check Script

Run these commands one by one:

```powershell
# 1. Check Docker is running
docker ps

# 2. Check service status
docker-compose ps

# 3. Start services if needed
docker-compose up -d

# 4. View recent logs
docker-compose logs --tail=50 auth-service

# 5. Check for email initialization
docker-compose logs auth-service | Select-String -Pattern "Email service"
```

## If Services Aren't Running

If `docker-compose ps` shows nothing or services are stopped:

```powershell
# Build and start all services
docker-compose up -d --build

# Watch logs in real-time
docker-compose logs -f auth-service
```

## Test Email Sending

Once services are running, test by registering a user:

```powershell
# Using PowerShell Invoke-WebRequest
$body = @{
    email = "test@example.com"
    password = "Test1234"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

# Then check logs for email sending
docker-compose logs auth-service | Select-String -Pattern "email|Email|verification"
```
