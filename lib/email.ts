import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Email sending error:', error);
    }
    throw error;
  }
};

// Add missing sendVerificationEmail function
export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verify Your Email</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;

  return sendEmail(to, 'Verify Your Email - WeddingLK', html);
};
