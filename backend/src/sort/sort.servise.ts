import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Products } from '../models/products.model';
import { SortDto } from './dto/sort.dto';
import { Op } from 'sequelize';

@Injectable()
export class SortService {
  constructor(
    @InjectModel(Products)
    private productModel: typeof Products,
  ) {}

  async getSort(query: SortDto) {
    const { fuelType, V, speed, path, owner, price, rating, name } = query;
    const whereClause: any = {};

    try {
      // Фильтрация по типу топлива (если fuelType есть в модели)
      if (fuelType) {
        whereClause.fuelType = fuelType === 'бензин' ? 'Бензин' : 'Газ';
      }

      // Фильтрация по объему топлива (если V есть в модели)
      if (V) {
        if (V === 'менее 500 л') {
          whereClause.fuelVolume = { [Op.lt]: 500 };
        } else if (V === 'более 500 л') {
          whereClause.fuelVolume = { [Op.gt]: 500 };
        }
      }

      // Фильтрация по скорости (если speed есть в модели)
      if (speed) {
        if (speed === 'Больше 150км/ч') {
          whereClause.speed = { [Op.gt]: 150 };
        } else if (speed === 'Меньше 150км/ч') {
          whereClause.speed = { [Op.lt]: 150 };
        }
      }

      // Фильтрация по пути (если path есть в модели)
      if (path) {
        if (path === 'Больше 150км') {
          whereClause.mileage = { [Op.gt]: 150 };
        } else if (path === 'Меньше 150км') {
          whereClause.mileage = { [Op.lt]: 150 };
        }
      }

      // Фильтрация по количеству владельцев (если owner_count есть в модели)
      if (owner) {
        whereClause.owner_count = owner;
      }

      // Фильтрация по цене
      if (price) {
        if (price === 'менее 500 тр') {
          whereClause.price = { [Op.lt]: 500000 };
        } else if (price === 'более 500 тр') {
          whereClause.price = { [Op.gt]: 500000 };
        }
      }

      // Фильтрация по рейтингу (если rating есть в модели)
      if (rating) {
        whereClause.rating = rating;
      }

      // Фильтрация по имени
      if (name) {
        whereClause.name = { [Op.iLike]: `%${name}%` };
      }

      // Выполнение запроса
      const products = await this.productModel.findAll({
        where: whereClause,
      });

      return products;
    } catch (error) {
      console.error('Ошибка сортировки:', error);
      return {
        message: 'Ошибка сортировки!!!',
        error: error.message,
      };
    }
  }
}