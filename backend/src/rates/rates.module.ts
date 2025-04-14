import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ratings } from '../models/ratings.model';
import { Products } from '../models/products.model';

@Module({
  imports: [SequelizeModule.forFeature([Products, Ratings])], // Импортируем модели
  controllers: [RatesController],
  providers: [RatesService],
  exports: [RatesService],
})
export class RatesModule {}
