import nodemailer from "nodemailer";

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export function createSystemTransporter(): nodemailer.Transporter {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SYSTEM_EMAIL_USER!,
      pass: process.env.SYSTEM_EMAIL_PASSWORD!,
    },
  });
}

export function createUserTransporter(smtpConfig: SmtpConfig): nodemailer.Transporter {
  return nodemailer.createTransport(smtpConfig);
}

export async function sendEmail(
  transporter: nodemailer.Transporter,
  options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }
): Promise<void> {
  await transporter.sendMail({
    from: `"Toohak" <${process.env.SYSTEM_EMAIL_USER!}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}
