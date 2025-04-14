import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GmailService } from './gmail.service';
import { GmailController } from './gmail.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [GmailController],
  providers: [GmailService],
})
export class GmailModule {}
