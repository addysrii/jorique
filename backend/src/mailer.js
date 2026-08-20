import nodemailer from 'nodemailer';

const smtpPort = Number(process.env.SMTP_PORT || 587);

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(email, otp) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await mailer.sendMail({
    from,
    to: email,
    subject: 'Your JORIQUE verification code',
    text: `Your JORIQUE verification code is ${otp}. It expires shortly.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #2e2e2e; line-height: 1.6;">
        <p>Your JORIQUE verification code is:</p>
        <p style="font-size: 28px; letter-spacing: 8px; font-weight: 700;">${otp}</p>
        <p>This code expires shortly. If you did not request it, you can ignore this email.</p>
      </div>
    `,
  });
}
