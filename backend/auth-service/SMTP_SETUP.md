# SMTP Setup Guide

This guide will walk you through setting up SMTP email for the Remi auth service with various email providers.

## Quick Setup Steps

1. **Choose your email provider** (Gmail, Outlook, Custom SMTP, etc.)
2. **Get your SMTP credentials** (host, port, username, password)
3. **Configure environment variables**
4. **Test the setup**

---

## Option 1: Gmail SMTP Setup

Gmail is popular for development and small-scale production use.

### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", enable **2-Step Verification**

### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Or navigate: Google Account → Security → 2-Step Verification → App passwords
2. Select "Mail" and "Other (Custom name)"
3. Enter "Remi Auth Service" as the name
4. Click "Generate"
5. **Copy the 16-character password** (you'll see something like: `abcd efgh ijkl mnop`)

⚠️ **Important:** Use this App Password, NOT your regular Gmail password!

### Step 3: Configure Environment Variables

#### Using Docker Compose

Edit `backend/docker-compose.yml` and update the `auth-service` section:

```yaml
auth-service:
  environment:
    # ... other variables ...
    EMAIL_PROVIDER: smtp
    SMTP_HOST: smtp.gmail.com
    SMTP_PORT: 587
    SMTP_USER: your-email@gmail.com
    SMTP_PASSWORD: gqmv kmgt rxwz ubbi  # Your app password (remove spaces)
    SMTP_SECURE: false
    EMAIL_FROM: macdonaldsairos01@gmail.com
    EMAIL_FROM_NAME: Remipey
```

#### Using .env File (Recommended)

Create a `.env` file in the `backend` directory:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
SMTP_SECURE=false
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Remi
```

Then update `docker-compose.yml` to use the env file:

```yaml
auth-service:
  env_file:
    - .env
```

### Step 4: Test

1. Restart your services:
   ```bash
   cd backend
   docker-compose restart auth-service
   ```

2. Check logs to verify email service initialized:
   ```bash
   docker-compose logs auth-service | grep -i email
   ```
   You should see: `✅ Email service initialized with SMTP (smtp.gmail.com:587)`

3. Register a new user and check your email inbox!

---

## Option 2: Outlook/Hotmail SMTP Setup

### Step 1: Enable App Password

1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Enable **Two-step verification** if not already enabled
3. Go to **App passwords** (under "Advanced security options")
4. Generate a new app password for "Mail"
5. **Copy the password**

### Step 2: Configure

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-app-password
SMTP_SECURE=false
EMAIL_FROM=your-email@outlook.com
EMAIL_FROM_NAME=Remi
```

---

## Option 3: Custom SMTP Server

If you have your own email server or use a hosting provider (like cPanel, Plesk, etc.)

### Step 1: Get SMTP Details

Contact your hosting provider or check your email settings. Common details:

- **Host:** Usually `mail.yourdomain.com` or `smtp.yourdomain.com`
- **Port:** Usually `587` (TLS) or `465` (SSL)
- **Username:** Your full email address
- **Password:** Your email password

### Step 2: Configure

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-email-password
SMTP_SECURE=false
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Remi
```

### For SSL (Port 465)

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-email-password
SMTP_SECURE=true
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Remi
```

---

## Option 4: Professional Email Services

### Mailgun

1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Verify your domain
3. Get SMTP credentials from the dashboard

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.com
SMTP_PASSWORD=your-mailgun-password
SMTP_SECURE=false
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Remi
```

### Amazon SES

1. Set up AWS SES
2. Verify your email or domain
3. Get SMTP credentials from AWS Console

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=email-smtp.us-east-1.amazonaws.com  # Your region's SMTP endpoint
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
SMTP_SECURE=false
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Remi
```

### Zoho Mail

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=your-email@zoho.com
SMTP_PASSWORD=your-zoho-password
SMTP_SECURE=false
EMAIL_FROM=your-email@zoho.com
EMAIL_FROM_NAME=Remi
```

---

## Complete Setup Example (Gmail with .env)

### Step 1: Create .env file

Create `backend/.env`:

```env
# Email Configuration
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=myapp@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
SMTP_SECURE=false
EMAIL_FROM=myapp@gmail.com
EMAIL_FROM_NAME=Remi
```

### Step 2: Update docker-compose.yml

Update the `auth-service` section to load the .env file:

```yaml
auth-service:
  env_file:
    - .env
  # OR manually set variables:
  environment:
    EMAIL_PROVIDER: ${EMAIL_PROVIDER:-console}
    SMTP_HOST: ${SMTP_HOST:-}
    SMTP_PORT: ${SMTP_PORT:-587}
    SMTP_USER: ${SMTP_USER:-}
    SMTP_PASSWORD: ${SMTP_PASSWORD:-}
    SMTP_SECURE: ${SMTP_SECURE:-false}
    EMAIL_FROM: ${EMAIL_FROM:-noreply@remi.com}
    EMAIL_FROM_NAME: ${EMAIL_FROM_NAME:-Remi}
```

### Step 3: Restart Services

```bash
cd backend
docker-compose down
docker-compose up -d
```

### Step 4: Verify Setup

Check the logs:

```bash
docker-compose logs auth-service
```

Look for:
```
✅ Email service initialized with SMTP (smtp.gmail.com:587)
```

If you see:
```
⚠️  No valid email configuration found. Using console mode.
```

Check that your environment variables are set correctly.

---

## Testing Your Setup

### Test Email Sending

1. **Start the services:**
   ```bash
   cd backend
   docker-compose up
   ```

2. **Register a new user** via your app or API:
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "Test1234",
       "firstName": "Test",
       "lastName": "User"
     }'
   ```

3. **Check your email inbox** - you should receive a verification email!

4. **Check service logs** to see email sending status:
   ```bash
   docker-compose logs -f auth-service
   ```

---

## Troubleshooting

### Issue: "Authentication failed" or "Invalid login"

**Gmail:**
- ✅ Make sure you're using an **App Password**, not your regular password
- ✅ Ensure 2-Factor Authentication is enabled
- ✅ Check that the password doesn't have spaces (remove them)

**Other providers:**
- ✅ Verify username is the full email address
- ✅ Check password is correct
- ✅ Ensure SMTP access is enabled in your account settings

### Issue: "Connection timeout" or "ECONNREFUSED"

- ✅ Check your firewall isn't blocking port 587 or 465
- ✅ Verify SMTP_HOST is correct
- ✅ Try port 465 with `SMTP_SECURE=true`
- ✅ Check if your network blocks SMTP (some corporate networks do)

### Issue: "Self-signed certificate" errors

Add this to your email service code (only for development):

```typescript
// In emailService.ts, add to transporter config:
tls: {
  rejectUnauthorized: false  // Only for development!
}
```

**⚠️ Warning:** Never use this in production!

### Issue: Emails going to spam

- ✅ Set up SPF records for your domain
- ✅ Set up DKIM signing
- ✅ Use a professional email service (SendGrid, Mailgun)
- ✅ Verify your domain
- ✅ Use a proper FROM address (not a free email service)

### Issue: Still seeing console mode

Check your environment variables are loaded:

```bash
docker-compose exec auth-service env | grep SMTP
```

If empty, verify your `.env` file or docker-compose.yml configuration.

---

## Security Best Practices

1. **Never commit passwords to git**
   - Add `.env` to `.gitignore`
   - Use environment variables or secrets management

2. **Use App Passwords**
   - Don't use your main account password
   - Revoke app passwords if compromised

3. **Use a dedicated email account**
   - Don't use personal email for production
   - Set up `noreply@yourdomain.com` for transactional emails

4. **Restrict access**
   - Use environment variables
   - Don't hardcode credentials
   - Use secrets management in production (Kubernetes secrets, AWS Secrets Manager, etc.)

---

## Common SMTP Ports

| Port | Protocol | Use Case |
|------|----------|----------|
| 587 | STARTTLS | Recommended for most providers |
| 465 | SSL/TLS | Alternative secure port |
| 25 | Plain | Not recommended (often blocked) |
| 2525 | STARTTLS | Alternative port (some providers) |

---

## Quick Reference: Environment Variables

```env
# Required
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.example.com
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password

# Optional (with defaults)
SMTP_PORT=587              # Default: 587
SMTP_SECURE=false          # Default: false (true for port 465)
EMAIL_FROM=noreply@remi.com
EMAIL_FROM_NAME=Remi
```

---

## Need Help?

- Check the main [EMAIL_SETUP.md](./EMAIL_SETUP.md) for general email configuration
- Review service logs: `docker-compose logs auth-service`
- Verify environment variables are loaded correctly
- Test SMTP connection manually using a tool like `telnet` or `openssl`

Example test:
```bash
openssl s_client -connect smtp.gmail.com:587 -starttls smtp
```
