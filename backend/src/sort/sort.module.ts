import { Module } from '@nestjs/common';
import { SortController } from './sort.controller';
import { SortService } from './sort.servise';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ratings } from '../models/ratings.model';
import { Products } from '../models/products.model';

@Module({
  imports: [SequelizeModule.forFeature([Ratings, Products])], // Подключаем модели
  providers: [SortService],
  controllers: [SortController],
  exports: [SortService], // Экспортируем только сервис, если он нужен
})
export class SortModule {}
