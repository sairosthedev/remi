# Email Service Configuration Guide

The auth service now includes a fully functional email service for sending verification codes and transactional emails.

## Quick Start

### Option 1: Console Mode (Development - Default)

For development, the service runs in console mode by default. Emails will be logged to the console instead of being sent.

**No configuration needed!** Just run the service and check the console logs for verification codes.

### Option 2: SMTP (Recommended for Production)

Configure any SMTP server (Gmail, Outlook, custom SMTP, etc.)

#### Example: Gmail

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_SECURE=false
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Remi
```

**Note for Gmail:** You'll need to:
1. Enable 2-factor authentication
2. Generate an "App Password" (not your regular password)
3. Use the app password in `SMTP_PASSWORD`

#### Example: Custom SMTP

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASSWORD=your-password
SMTP_SECURE=false
EMAIL_FROM=noreply@example.com
EMAIL_FROM_NAME=Remi
```

#### Example: Secure SMTP (Port 465)

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=noreply@example.com
SMTP_PASSWORD=your-password
SMTP_SECURE=true
EMAIL_FROM=noreply@example.com
EMAIL_FROM_NAME=Remi
```

### Option 3: SendGrid (Recommended for High Volume)

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API Key
3. Configure:

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your-api-key-here
EMAIL_FROM=noreply@remi.com
EMAIL_FROM_NAME=Remi
```

**Note:** Make sure to verify your sender email in SendGrid dashboard.

## Configuration Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `EMAIL_PROVIDER` | Provider type: `console`, `smtp`, or `sendgrid` | `console` | No |
| `EMAIL_FROM` | From email address | `noreply@remi.com` | No |
| `EMAIL_FROM_NAME` | From name | `Remi` | No |
| `SMTP_HOST` | SMTP server hostname | - | Yes (if SMTP) |
| `SMTP_PORT` | SMTP server port | `587` | No |
| `SMTP_USER` | SMTP username | - | Yes (if SMTP) |
| `SMTP_PASSWORD` | SMTP password | - | Yes (if SMTP) |
| `SMTP_SECURE` | Use TLS/SSL | `false` | No |
| `SENDGRID_API_KEY` | SendGrid API key | - | Yes (if SendGrid) |

## Docker Compose Setup

### Using Environment File

Create a `.env` file in the `backend` directory:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Remi
```

The docker-compose.yml will automatically use these variables.

### Direct Configuration

Edit `docker-compose.yml` and update the `auth-service` environment section:

```yaml
environment:
  EMAIL_PROVIDER: smtp
  SMTP_HOST: smtp.gmail.com
  SMTP_PORT: 587
  SMTP_USER: your-email@gmail.com
  SMTP_PASSWORD: your-app-password
  EMAIL_FROM: your-email@gmail.com
  EMAIL_FROM_NAME: Remi
```

## Testing

### Test in Console Mode

1. Start the service (defaults to console mode)
2. Register a new user
3. Check the console logs for the verification code

### Test with Real Email

1. Configure your email provider
2. Start the service
3. Register a new user
4. Check the email inbox for verification code

## Email Templates

The service includes beautifully formatted HTML email templates for:
- **Verification codes** - Sent during registration
- **Password reset codes** - (Ready for future implementation)

Templates are mobile-responsive and styled to match the Remi brand.

## Troubleshooting

### Emails not being sent

1. Check the logs for error messages
2. Verify your credentials are correct
3. For Gmail, ensure you're using an App Password, not your regular password
4. Check firewall/network settings (SMTP ports may be blocked)
5. Verify your email provider allows SMTP access

### Gmail "Less secure app" errors

Gmail requires App Passwords when 2FA is enabled:
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password
4. Use that password in `SMTP_PASSWORD`

### SendGrid errors

1. Verify your API key is correct
2. Check that your sender email is verified in SendGrid
3. Ensure your SendGrid account is not suspended

### Development fallback

Even if email sending fails, the service will:
1. Log the error
2. Fall back to console logging (in dev mode)
3. Continue processing (registration still succeeds)

This ensures the service remains available even if email is temporarily unavailable.

## Production Recommendations

1. **Use SendGrid or similar service** for reliability and deliverability
2. **Set up email monitoring** to track delivery rates
3. **Configure SPF/DKIM records** for your domain
4. **Set up email queuing** for high-volume scenarios
5. **Monitor bounce rates** and handle invalid emails
6. **Use environment-specific FROM addresses** (e.g., `noreply@staging.remi.com` for staging)
