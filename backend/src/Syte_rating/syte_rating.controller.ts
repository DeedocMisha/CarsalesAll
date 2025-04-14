  import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
  import { SyteRatingService } from './syte_rating.servise';
  import { SendMessageDto } from './dto/Send.Message.dto';

  @Controller("rating")
  export class SyteRatingController {
    constructor(private readonly syteRatingService: SyteRatingService) {}

    @Post('sendRating')
    SendMess(@Body() sendMessageDto: SendMessageDto): any {
      return this.syteRatingService.SendMessage(sendMessageDto);
    }
    @Get('getRating')
    GetRat(): any {
      return this.syteRatingService.GetRating();
    }
  }
