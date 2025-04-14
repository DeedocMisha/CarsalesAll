import { Module } from '@nestjs/common';
import { SyteRatingController } from './syte_rating.controller';
import { SyteRatingService } from './syte_rating.servise';
import { SequelizeModule } from '@nestjs/sequelize';
import { SyteRating } from '../models/SyteRating';

@Module({
  imports: [SequelizeModule.forFeature([SyteRating])], // Подключаем модель
  controllers: [SyteRatingController],
  providers: [SyteRatingService],
  exports: [SequelizeModule],
})
export class SyteRatingModule {}
