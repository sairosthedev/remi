# Rebuild Auth Service to Load Email Service

Your services are running but using the OLD code (before email service was added). You need to rebuild to load the new email service code.

## Quick Rebuild

Run these commands:

```powershell
# 1. Stop services
docker-compose down

# 2. Rebuild the auth-service (this will include the new email service code)
docker-compose build auth-service

# 3. Start services again
docker-compose up -d

# 4. Check logs for email service initialization
docker-compose logs auth-service | Select-String -Pattern "Email service"
```

## Expected Output After Rebuild

After rebuilding, you should see one of these in the logs:

**If SMTP is configured:**
```
✅ Email service initialized with SMTP (smtp.gmail.com:587)
```

**If console mode (default):**
```
📧 Email service initialized in console mode
```

**If no configuration:**
```
⚠️  No valid email configuration found. Using console mode.
```

## Verify It's Working

1. **Check initialization:**
   ```powershell
   docker-compose logs auth-service | Select-String -Pattern "Email service"
   ```

2. **View all recent logs:**
   ```powershell
   docker-compose logs --tail=20 auth-service
   ```

3. **Test by registering a user** (the email will be sent/logged)

## Why This Is Needed

The container was built **2 hours ago** (before the email service was added). Docker containers use the code that was built when the image was created. New files added to the source code won't appear until you rebuild the container.

## Alternative: Full Rebuild

If you want to rebuild all services:

```powershell
docker-compose down
docker-compose build
docker-compose up -d
```

But you only need to rebuild `auth-service` since that's the only one we changed.
