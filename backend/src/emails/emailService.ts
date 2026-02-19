// src/emails/emailService.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const emailWrapper = (title: string, content: string): string => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
      .header { background: #4F46E5; color: white; padding: 30px; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; }
      .body { padding: 30px; color: #333; line-height: 1.6; }
      .btn { display: inline-block; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 20px 0; }
      .btn-primary { background: #4F46E5; color: white; }
      .btn-danger { background: #DC2626; color: white; }
      .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888; }
      .divider { border: none; border-top: 1px solid #eee; margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>🔐 Auth System</h1></div>
      <div class="body">${content}</div>
      <div class="footer">© 2024 Auth System. This email is automatically generated.</div>
    </div>
  </body>
  </html>
`;

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
): Promise<void> => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const content = `
    <h2>wellcome, ${name}! 👋</h2>
    <p>Welcome to Auth System! Please verify your email address.</p>
    <hr class="divider">
    <p><strong>click on button for verifying email:</strong></p>
    <a href="${verifyUrl}" class="btn btn-primary">✅Verifying your Email</a>
    <hr class="divider">
    <p style="color: #888; font-size: 13px;">⏰ This link expire in <strong>1 hour .</strong></p>
    <p style="color: #888; font-size: 13px;">if you did not request this email, please ignore it.</p>
  `;

  await transporter.sendMail({
    from: `"Auth System" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "✅ Verify Email  - Auth System",
    html: emailWrapper("Email Verification", content),
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const content = `
    <h2>Password Reset Request 🔑</h2>
    <p> HI , ${name}!</p>
    <p>if you did not request this password reset, please ignore this email.</p>
    <hr class="divider">
    <a href="${resetUrl}" class="btn btn-danger">🔑 Password Reset Karein</a>
    <hr class="divider">
    <p style="color: #888; font-size: 13px;">⏰ This link is valid for only <strong>1 hour</strong>.</p>
    <p style="color: #888; font-size: 13px;">⚠️ If you did not request this password reset, please change your password immediately.</p>
  `;

  await transporter.sendMail({
    from: `"Auth System" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "🔑 Password Reset - Auth System",
    html: emailWrapper("Password Reset", content),
  });
};

export const sendPasswordChangedEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const content = `
    <h2>Password Changed Successfully ✅</h2>
    <p> Hi, ${name}!</p>
    <p>Your password has been successfully changed.</p>
    <hr class="divider">
    <p style="color: #888; font-size: 13px;">⚠️ If you did not change your password, please contact support immediately.</p>
  `;

  await transporter.sendMail({
    from: `"Auth System" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "✅ Password Changed Successfully - Auth System",
    html: emailWrapper("Password Changed", content),
  });
};
