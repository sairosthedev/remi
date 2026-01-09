# Docker Desktop Not Running - Fix Guide

## Problem

The error you're seeing:
```
error during connect: Get "http://%2F%2F.%2Fpipe%2DockerDesktopLinuxEngine/...": 
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

This means **Docker Desktop is not running** or hasn't fully started yet.

## Solution

### Step 1: Start Docker Desktop

1. **Open Docker Desktop application**
   - Look for Docker Desktop in your Start menu
   - Or search for "Docker Desktop" in Windows search
   - Click to launch it

2. **Wait for Docker to fully start**
   - You'll see a Docker whale icon in your system tray (bottom-right)
   - Wait until it shows "Docker Desktop is running"
   - This can take 30-60 seconds

3. **Verify Docker is running**

   Open PowerShell and run:
   ```powershell
   docker ps
   ```

   **If Docker is running**, you'll see something like:
   ```
   CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
   ```

   **If Docker is NOT running**, you'll see:
   ```
   error during connect: ...
   ```

### Step 2: Verify Docker Desktop Status

**Method 1: Check System Tray**
- Look at the bottom-right of your screen
- Find the Docker whale icon 🐋
- Hover over it - it should say "Docker Desktop is running"

**Method 2: Check Docker Version**
```powershell
docker version
```

If this works, Docker is running. If it fails, Docker is not running.

**Method 3: Check Docker Desktop UI**
- Open Docker Desktop application
- You should see a green indicator showing it's running

### Step 3: Start Your Services

Once Docker Desktop is running:

```powershell
# Navigate to backend directory
cd C:\Users\macdo\Documents\GitHub\remi\backend

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

### Step 4: Check Logs

Now you can check logs:

```powershell
# View auth service logs
docker-compose logs auth-service

# Filter for email-related logs
docker-compose logs auth-service | Select-String -Pattern "Email service"

# Watch logs in real-time
docker-compose logs -f auth-service
```

## Troubleshooting

### Docker Desktop Won't Start

1. **Restart Docker Desktop**
   - Right-click the Docker icon in system tray
   - Click "Quit Docker Desktop"
   - Wait a few seconds
   - Start Docker Desktop again

2. **Check Windows Services**
   - Press `Win + R`
   - Type `services.msc` and press Enter
   - Look for "Docker Desktop Service"
   - Make sure it's "Running"

3. **Restart Your Computer**
   - Sometimes Docker Desktop needs a full restart

4. **Check Docker Desktop Settings**
   - Open Docker Desktop
   - Go to Settings → General
   - Make sure "Use the WSL 2 based engine" is checked (if available)
   - Click "Apply & Restart"

### Docker Desktop is Slow to Start

- **First start** can take 1-2 minutes
- **Subsequent starts** should be faster (30-60 seconds)
- Make sure you have enough resources allocated:
  - Docker Desktop → Settings → Resources
  - Recommended: 4GB RAM, 2 CPU cores minimum

### Still Having Issues?

1. **Check Docker Desktop logs:**
   - Docker Desktop → Troubleshoot → View logs

2. **Verify WSL 2 is installed** (if using WSL backend):
   ```powershell
   wsl --status
   ```

3. **Check Windows updates:**
   - Make sure Windows is up to date
   - Docker Desktop requires Windows 10/11 with WSL 2

## Quick Checklist

- [ ] Docker Desktop application is open
- [ ] Docker whale icon appears in system tray
- [ ] System tray shows "Docker Desktop is running"
- [ ] `docker ps` command works without errors
- [ ] `docker-compose ps` shows your services (or at least doesn't error)

## After Docker Starts

Once Docker Desktop is running, you can:

1. **Start services:**
   ```powershell
   cd C:\Users\macdo\Documents\GitHub\remi\backend
   docker-compose up -d
   ```

2. **Check email service:**
   ```powershell
   docker-compose logs auth-service | Select-String -Pattern "Email service"
   ```

3. **View all logs:**
   ```powershell
   docker-compose logs -f auth-service
   ```

---

**Remember:** Docker Desktop must be running before you can use any `docker` or `docker-compose` commands!
