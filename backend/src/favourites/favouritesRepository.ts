import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Favourites } from '../models/favourites.model';

@Injectable()
export class FavouritesRepository {
  constructor(
    @InjectModel(Favourites) private readonly favouritesModel: typeof Favourites,
  ) {}

  // Метод для поиска избранного по заданным опциям
  async findOne(options): Promise<Favourites | null> {
    return this.favouritesModel.findOne(options);
  }

  // Метод для создания записи в избранном
  async create(favouriteData): Promise<Favourites> {
    return this.favouritesModel.create(favouriteData);
  }

  // Метод для удаления записи из избранного
  async remove(favouriteId: number): Promise<void> {
    const favourite = await this.favouritesModel.findByPk(favouriteId);
    if (favourite) {
      await favourite.destroy();
    }
  }

  // Другие методы для работы с избранным
}
