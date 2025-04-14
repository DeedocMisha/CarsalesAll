import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const gmailUser = this.configService.get<string>('GMAIL_USER');
    const gmailPass = this.configService.get<string>('GMAIL_PASS');

    if (!gmailUser || !gmailPass) {
      throw new Error('Gmail credentials not configured');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }

  async sendMessage(mailOptions: {
    to: string;
    from?: string;
    subject: string;
    text: string;
  }): Promise<{ success: boolean; message?: string }> {
    try {
      const finalOptions = {
        from: mailOptions.from || this.configService.get<string>('GMAIL_USER'),
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: mailOptions.text,
      };

      await this.transporter.sendMail(finalOptions);
      return { success: true, message: 'Message sent successfully' };
    } catch (error: unknown) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}