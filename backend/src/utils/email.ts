import nodemailer from 'nodemailer';
import { env } from '../config/env';

let transporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter) return transporter;

  const hasSmtpConfig = env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS;

  if (hasSmtpConfig) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT || 587,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  } else {
    console.log('SMTP credentials not configured in environment. Creating Ethereal Mail test account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`Ethereal account generated: User=${testAccount.user}`);
    } catch (err) {
      console.error('Failed to create Ethereal Mail account, falling back to basic logger:', err);
      // Fallback transporter that logs to console
      transporter = {
        sendMail: async (mailOptions: any) => {
          console.log('\n--- EMAIL LOGGER FALLBACK ---');
          console.log(`To: ${mailOptions.to}`);
          console.log(`Subject: ${mailOptions.subject}`);
          console.log(`Body: ${mailOptions.html}`);
          console.log('-----------------------------\n');
          return { messageId: 'log-id-' + Math.random().toString(36).substr(2, 9) };
        }
      } as unknown as nodemailer.Transporter;
    }
  }

  return transporter;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const client = await getTransporter();
    const info = await client.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully: ID=${info.messageId}`);
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`\n========================================`);
      console.log(`[Ethereal Mail Link]: ${previewUrl}`);
      console.log(`========================================\n`);
    }
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
