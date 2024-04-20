import nodemailer, { Transporter } from "nodemailer";

interface Attachments {
  filename: string;
  path: string;
}

interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachments[];
}

export class EmailService {
  private transporter: Transporter

  constructor(mailerService: string, mailerEmail: string, mailerSecretKey: string) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: mailerSecretKey,
      },
    });
  }

  async sendEmail(options: SendMailOptions) {
    const mailOptions = {
      to: options.to,
      subject: options.subject,
      html: options.htmlBody,
      attachments: options.attachments ?? [],
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      return false;
    }
  }
}
