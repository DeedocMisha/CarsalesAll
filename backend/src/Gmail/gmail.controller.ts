import { Body, Controller, Post, Get, Logger } from '@nestjs/common';
import { GmailService } from './gmail.service';
import { SendMessDto } from './dto/sendMess.dto';
import { ConfigService } from '@nestjs/config';

@Controller('')
export class GmailController {
  private readonly logger = new Logger(GmailController.name);

  constructor(
    private readonly gmailService: GmailService,
    private readonly configService: ConfigService,
  ) {}

  @Post('contact')
  async sendMess(@Body() sendMessDto: SendMessDto) {
    this.logger.log(
      `Received contact form submission: ${JSON.stringify(sendMessDto)}`,
    );

    try {
      const mailOptions = {
        to: 'mysytes2490@gmail.com',
        from: sendMessDto.email,
        subject: `New message from ${sendMessDto.name}`,
        text: `Name: ${sendMessDto.name}\nEmail: ${sendMessDto.email}\nMessage: ${sendMessDto.message}`,
      };

      this.logger.debug(
        `Sending email with options: ${JSON.stringify(mailOptions)}`,
      );

      const result = await this.gmailService.sendMessage(mailOptions);
      this.logger.log('Email sent successfully');
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }
}
