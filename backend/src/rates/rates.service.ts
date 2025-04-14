import { Injectable } from '@nestjs/common';
import { Ratings } from '../models/ratings.model';
import { Products } from '../models/products.model';
import { PostRateDto } from './dto/postRate.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RatesService {
  constructor(
    @InjectModel(Products) private readonly productsTable: typeof Products,
    @InjectModel(Ratings) private readonly ratingTable: typeof Ratings,
  ) {}

  // Метод для создания отзыва
  async createRate(postRateDto: PostRateDto) {
    try {
      // Проверяем, существует ли продукт
      const product = await this.productsTable.findOne({
        where: { product_id: postRateDto.product_id },
      });

      if (!product) {
        return { message: 'Продукт не найден' };
      }

      // Создаём новый отзыв
      const rate = await this.ratingTable.create({
        product_id: postRateDto.product_id,
        user_id: postRateDto.user_id, // добавили user_id
        rating: postRateDto.rating,
        comment: postRateDto.comment ?? '', // Если комментарий не передан, сохраняем пустую строку
      });

      return { message: 'Отзыв успешно добавлен', rate };
    } catch (error) {
      console.error('Ошибка добавления отзыва:', error);
      return { message: 'Ошибка добавления отзыва', error: error.message };
    }
  }

  // Метод для удаления отзыва
  async deleteRate(rating_Id: number) {
    try {
      const rate = await this.ratingTable.findOne({ where: { rating_id: rating_Id } });

      if (!rate) {
        return { message: 'Отзыв не найден' };
      }

      await rate.destroy();
      return { message: 'Отзыв удалён' };
    } catch (error) {
      console.error('Ошибка удаления отзыва:', error);
      return { message: 'Ошибка удаления отзыва', error: error.message };
    }
  }
}
