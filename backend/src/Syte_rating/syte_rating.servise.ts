import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/Send.Message.dto';
import { SyteRating } from '../models/SyteRating';
import { InjectModel } from '@nestjs/sequelize';
import { Products } from '../models/products.model';
import { Ratings } from '../models/ratings.model';
/* eslint-disable @typescript-eslint/no-unused-vars */
@Injectable()
export class SyteRatingService {
  constructor(
    @InjectModel(SyteRating) private readonly ratingsModel: typeof SyteRating,  // Используем InjectModel
  ) {}
  //TypeOf используется для получения типа переменной или выражения

  async GetRating() {
    try {
      return await this.ratingsModel.findAll();
    } catch (error) {
      console.log('Ошибка получения озыва');
      const ErrorObject = {
        message: 'Ошибка отправки отзыва!!!',
      };
      return ErrorObject;
    }
  }

  async SendMessage(sendMessageDto: SendMessageDto) {
    try {
      const ratingData = {
        ...sendMessageDto,
        user_id: sendMessageDto.userId
      };
      return await this.ratingsModel.create(ratingData);
    } catch (error) {
      console.error('Failed to send rating:', error);
      return {
        message: 'Ошибка отправки отзыва!!!',
        error: error.message
      };
    }
  }
}
