import nodemailer, { Transporter } from 'nodemailer';

// Email configuration
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'smtp'; // 'smtp', 'sendgrid', 'console'
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@remi.com';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Remi';

// SMTP Configuration
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';

// SendGrid Configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      if (EMAIL_PROVIDER === 'console') {
        // Console mode - just log emails (useful for development)
        console.log('📧 Email service initialized in console mode');
        return;
      }

      if (EMAIL_PROVIDER === 'sendgrid' && SENDGRID_API_KEY) {
        // SendGrid configuration
        this.transporter = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: 'apikey',
            pass: SENDGRID_API_KEY,
          },
        });
        console.log('✅ Email service initialized with SendGrid');
        return;
      }

      // SMTP configuration (default)
      if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
        this.transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_SECURE, // true for 465, false for other ports
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
          },
          // For Gmail, you might need:
          // tls: {
          //   rejectUnauthorized: false
          // }
        });
        console.log(`✅ Email service initialized with SMTP (${SMTP_HOST}:${SMTP_PORT})`);
        return;
      }

      // Fallback to console mode if no valid configuration
      console.warn('⚠️  No valid email configuration found. Using console mode.');
      console.warn('   Set EMAIL_PROVIDER, SMTP_HOST, SMTP_USER, SMTP_PASSWORD or SENDGRID_API_KEY');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
      console.warn('⚠️  Falling back to console mode');
    }
  }

  /**
   * Send verification code email
   */
  async sendVerificationCode(email: string, code: string, firstName?: string): Promise<boolean> {
    const subject = 'Verify Your Remi Account';
    const html = this.getVerificationEmailTemplate(code, firstName);

    return this.sendEmail(email, subject, html);
  }

  /**
   * Send password reset email (for future use)
   */
  async sendPasswordResetCode(email: string, code: string, firstName?: string): Promise<boolean> {
    const subject = 'Reset Your Remi Password';
    const html = this.getPasswordResetEmailTemplate(code, firstName);

    return this.sendEmail(email, subject, html);
  }

  /**
   * Generic email sending method
   */
  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      // Console mode for development
      if (EMAIL_PROVIDER === 'console' || !this.transporter) {
        console.log('\n' + '='.repeat(50));
        console.log('📧 EMAIL (Console Mode)');
        console.log('='.repeat(50));
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('Body:');
        console.log(html.replace(/<[^>]*>/g, '').substring(0, 200) + '...');
        console.log('='.repeat(50) + '\n');
        return true;
      }

      // Send actual email
      const info = await this.transporter.sendMail({
        from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
        to,
        subject,
        html,
      });

      console.log(`✅ Verification email sent to ${to} (Message ID: ${info.messageId})`);
      return true;
    } catch (error: any) {
      console.error(`❌ Failed to send email to ${to}:`, error.message);
      // Don't throw error - fail gracefully so user registration can still succeed
      // In production, you might want to queue failed emails for retry
      return false;
    }
  }

  /**
   * Verification email HTML template
   */
  private getVerificationEmailTemplate(code: string, firstName?: string): string {
    const name = firstName ? ` ${firstName}` : '';
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f7fa;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #00A859 0%, #008a47 100%); border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Welcome to Remi!</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #1a1a1a; font-size: 16px; line-height: 1.6;">
                                Hi${name},
                            </p>
                            <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Thank you for signing up! To complete your registration and start sending what matters to your loved ones, please verify your email address using the code below:
                            </p>
                            
                            <!-- Verification Code Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center; padding: 30px 20px;">
                                        <div style="display: inline-block; background: linear-gradient(135deg, #00A859 0%, #008a47 100%); padding: 20px 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,168,89,0.3);">
                                            <div style="font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                                ${code}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                This code will expire in 10 minutes. If you didn't create an account with Remi, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                                Need help? Contact us at <a href="mailto:support@remi.com" style="color: #00A859; text-decoration: none;">support@remi.com</a>
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} Remi. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
  }

  /**
   * Password reset email HTML template
   */
  private getPasswordResetEmailTemplate(code: string, firstName?: string): string {
    const name = firstName ? ` ${firstName}` : '';
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f7fa;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #00A859 0%, #008a47 100%); border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Password Reset</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #1a1a1a; font-size: 16px; line-height: 1.6;">
                                Hi${name},
                            </p>
                            <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password. Use the code below to create a new password:
                            </p>
                            
                            <!-- Verification Code Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center; padding: 30px 20px;">
                                        <div style="display: inline-block; background: linear-gradient(135deg, #00A859 0%, #008a47 100%); padding: 20px 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,168,89,0.3);">
                                            <div style="font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                                ${code}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                This code will expire in 10 minutes. If you didn't request a password reset, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                                Need help? Contact us at <a href="mailto:support@remi.com" style="color: #00A859; text-decoration: none;">support@remi.com</a>
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} Remi. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
  }
}

// Export singleton instance
export const emailService = new EmailService();
