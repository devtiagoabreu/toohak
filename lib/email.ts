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
  const user = process.env.SYSTEM_EMAIL_USER;
  const pass = process.env.SYSTEM_EMAIL_PASSWORD;

  if (!user || !pass) {
    // Transporte mock: não envia nada, apenas loga. Evita quebrar o build/start sem SMTP.
    return nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
    }) as nodemailer.Transporter;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user,
      pass,
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
    from: `"Toohak" <${process.env.SYSTEM_EMAIL_USER || "noreply@toohak.local"}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}
