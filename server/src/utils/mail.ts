import nodemailer, { Transporter } from "nodemailer";
import { boolean } from "yup";

export const sendMail = async (
  from: string,
  to: string,
  subject: string,
  message: string
): Promise<string | null> => {
  const service: string = process.env.MAIL_MAILER || "smtp";
  const host: string = process.env.MAIL_HOST || "";
  const port: number = Number(process.env.MAIL_PORT || 587);
  const user: string = process.env.MAIL_USERNAME || "";
  const pass: string = process.env.MAIL_PASSWORD || "";

  const transporter: Transporter = nodemailer.createTransport({
    service,
    host,
    port,
    auth: {
      user,
      pass,
    },
    logger: true,
  });

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: message,
    });
    return info.messageId;
  } catch (err: any) {
    return null;
  }
};
