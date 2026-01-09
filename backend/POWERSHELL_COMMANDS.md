# PowerShell Commands for Remi Backend

This guide provides PowerShell-compatible commands for Windows users.

## Prerequisites

### 1. Start Docker Desktop

Before running any Docker commands, make sure Docker Desktop is running:
- Open Docker Desktop application
- Wait for it to fully start (whale icon in system tray)
- Verify it's running: Docker Desktop should show "Docker Desktop is running"

### 2. Verify Docker is Running

```powershell
docker ps
```

If you see an error about `dockerDesktopLinuxEngine`, Docker Desktop is not running or not fully started.

---

## Common PowerShell Commands

### Check Docker Status

```powershell
docker ps
```

### Check Service Logs

**PowerShell (replace `grep`):**

```powershell
# View all auth-service logs
docker-compose logs auth-service

# Filter for email-related logs (PowerShell version)
docker-compose logs auth-service | Select-String -Pattern "email" -CaseSensitive:$false

# Follow logs in real-time
docker-compose logs -f auth-service
```

**Or use Where-Object:**

```powershell
docker-compose logs auth-service | Where-Object { $_ -match "email|Email|EMAIL" }
```

### Start Services

```powershell
cd backend
docker-compose up -d
```

### Restart a Specific Service

```powershell
docker-compose restart auth-service
```

### Stop Services

```powershell
docker-compose down
```

### Check Environment Variables

**PowerShell version (replaces `grep`):**

```powershell
docker-compose exec auth-service env | Select-String -Pattern "SMTP"

# Or
docker-compose exec auth-service env | Where-Object { $_ -match "SMTP" }
```

### Build Services

```powershell
docker-compose build
docker-compose up -d
```

---

## Testing Email Service

### 1. Start Services

```powershell
cd backend
docker-compose up -d
```

### 2. Check Email Service Initialization

```powershell
docker-compose logs auth-service | Select-String -Pattern "Email service"
```

You should see:
```
✅ Email service initialized with SMTP (smtp.gmail.com:587)
```

### 3. Watch Logs in Real-Time

```powershell
docker-compose logs -f auth-service
```

Press `Ctrl+C` to stop watching.

### 4. Test Registration

**PowerShell curl (Invoke-WebRequest):**

```powershell
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
```

**Or using curl (if installed):**

```powershell
curl.exe -X POST http://localhost:3001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"Test1234\",\"firstName\":\"Test\",\"lastName\":\"User\"}'
```

---

## Troubleshooting

### Docker Desktop Not Running

**Error:**
```
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.51/..."
```

**Solution:**
1. Open Docker Desktop application
2. Wait for it to fully start (check system tray)
3. Try the command again

### Check if Docker Desktop is Running

```powershell
docker version
```

If this fails, Docker Desktop is not running.

### Check Service Status

```powershell
docker-compose ps
```

This shows all running services and their status.

### View All Logs

```powershell
# All services
docker-compose logs

# Specific service
docker-compose logs auth-service

# Last 50 lines
docker-compose logs --tail=50 auth-service
```

### Filter Logs (PowerShell)

```powershell
# Find errors
docker-compose logs auth-service | Select-String -Pattern "error|Error|ERROR"

# Find email-related logs
docker-compose logs auth-service | Select-String -Pattern "email|Email|SMTP"

# Case-insensitive search
docker-compose logs auth-service | Select-String -Pattern "email" -CaseSensitive:$false
```

---

## Environment Variables in PowerShell

### Check Environment Variables in Container

```powershell
docker-compose exec auth-service env | Select-String -Pattern "EMAIL|SMTP"
```

### Set Environment Variables (Temporary)

```powershell
$env:EMAIL_PROVIDER = "smtp"
$env:SMTP_HOST = "smtp.gmail.com"
# ... etc
```

### Create .env File in PowerShell

```powershell
@"
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
SMTP_SECURE=false
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Remi
"@ | Out-File -FilePath ".env" -Encoding utf8
```

---

## Quick Reference: PowerShell vs Bash

| Bash Command | PowerShell Equivalent |
|--------------|----------------------|
| `grep pattern` | `Select-String -Pattern pattern` |
| `grep -i pattern` | `Select-String -Pattern pattern -CaseSensitive:$false` |
| `| grep` | `| Select-String` |
| `| grep -i` | `| Where-Object { $_ -match "pattern" }` |
| `cat file` | `Get-Content file` |
| `echo "text"` | `Write-Host "text"` or `"text"` |
| `&&` | `;` or separate commands |

---

## Common Workflow

### Full Setup and Test

```powershell
# 1. Navigate to backend directory
cd C:\Users\macdo\Documents\GitHub\remi\backend

# 2. Check Docker is running
docker ps

# 3. Start services
docker-compose up -d

# 4. Check logs for email service initialization
docker-compose logs auth-service | Select-String -Pattern "Email service"

# 5. Watch logs
docker-compose logs -f auth-service
```

### Restart After Configuration Changes

```powershell
# After updating .env or docker-compose.yml
cd C:\Users\macdo\Documents\GitHub\remi\backend
docker-compose restart auth-service
docker-compose logs -f auth-service
```

---

## Useful PowerShell Aliases (Optional)

Add these to your PowerShell profile for convenience:

```powershell
# Add to $PROFILE
function docker-logs-email {
    docker-compose logs auth-service | Select-String -Pattern "email|Email|SMTP" -CaseSensitive:$false
}

function docker-restart-auth {
    docker-compose restart auth-service
}

function docker-watch-auth {
    docker-compose logs -f auth-service
}
```

Then use:
```powershell
docker-logs-email
docker-restart-auth
docker-watch-auth
```
