import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { RatesService } from './rates.service';
import { PostRateDto } from './dto/postRate.dto';

@Controller("rates")
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Post('createRate')
  createRate(@Body() postRateDto: PostRateDto) {
    return this.ratesService.createRate(postRateDto);
  } 

  @Delete('deleteRate/:rating_id')
  deleteRate(@Param('rating_id') rating_Id: string) {
    return this.ratesService.deleteRate(Number(rating_Id));
  }
}
