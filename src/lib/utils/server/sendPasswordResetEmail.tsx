import config from '@/config';
import sendEmail from './sendEmail';

const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${config.base_url}/reset-password?token=${token}`;
  const subject = `Reset Your ${config.app_name} Password`;
  const html = `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 40px 20px; text-align: center;">
        <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);">
          <h2 style="color: #3F51B5;">Password Reset Request</h2>
          <p style="color: #333; font-size: 16px;">
            We've received a request to reset your password. Click the button below to set a new one:
          </p>

          <a href="${resetLink}" 
            style="display: inline-block; margin: 20px auto; padding: 14px 30px; background-color: #3F51B5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Reset Your Password
          </a>

          <p style="font-size: 14px; color: #555; margin-top: 30px;">
            If you didn’t request this change, you can safely ignore this email.
          </p>

          <p style="font-size: 12px; color: #999; margin-top: 10px;">
            This link will expire in <strong>5 minutes</strong> for security reasons.
          </p>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #aaa;">
          © ${new Date().getFullYear()} ${config.app_name} — All rights reserved.
        </p>
      </div>
    `;

  await sendEmail({ to: email, subject, html });
};

export default sendPasswordResetEmail;
