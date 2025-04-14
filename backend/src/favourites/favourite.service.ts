import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Favourites } from '../models/favourites.model';
import { CreateFavouriteDto } from './dto/CreateFavourite.dto';
import { Products } from '../models/products.model';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectModel(Favourites) private favouriteTable: typeof Favourites,
    @InjectModel(Products) private readonly productsTable: typeof Products,
  ) {}

  async getAllFavourites() {
    try {
      const resp = await this.favouriteTable.findAll();
      return await this.productsTable.findAll({
        where: { product_id: resp.map((product) => product.product_id) },
      });
    } catch (error) {
      return { message: 'Error getting all favourites' };
    }
  }

  async getFavouritesFromUser(userId: number) {
    try {
      const res = await this.favouriteTable.findAll({
        where: { user_id: userId },
      });
      const ProdIds = res.map((product) => product.product_id);
      return await this.productsTable.findAll({
        where: { product_id: ProdIds },
      });
    } catch (error) {
      return { message: 'Error getting favourites' };
    }
  }

  async createFavourite(createFavouriteDto: CreateFavouriteDto) {
    try {
      const favourite = await this.favouriteTable.create({
        product_id: createFavouriteDto.ProductId,
        user_id: createFavouriteDto.UserId,
      });
      return { message: 'Successfully added to favourites', favourite };
    } catch (error) {
      console.error('Ошибка при добавлении в избранное:', error);
      return {
        message: 'Ошибка добавления в избранное',
        error: error.message || error,
      };
    }
  }


  async deleteFavourite(createFavouriteDto: CreateFavouriteDto) {
    try {
      const result = await this.favouriteTable.destroy({
        where: {
          product_id: createFavouriteDto.ProductId,
          user_id: createFavouriteDto.UserId,
        }
      });

      if (result === 0) {
        throw new Error('Запись в избранном не найдена');
      }

      return {
        success: true,
        message: 'Успешно удалено из избранного',
      };
    } catch (error) {
      console.error('Ошибка при удалении из избранного:', error);
      return {
        success: false,
        message: 'Ошибка удаления из избранного',
      };
    }
  }
}
