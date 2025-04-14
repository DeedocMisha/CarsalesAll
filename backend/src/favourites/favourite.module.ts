import { Module } from '@nestjs/common';
import { FavouritesController } from './favourite.controller';
import { FavouriteService } from './favourite.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favourites } from '../models/favourites.model';
import { FavouritesRepository } from './favouritesRepository';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { Products } from '../models/products.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Favourites, Products]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'BestChange',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [FavouritesController],
  providers: [
    FavouritesRepository,
    FavouriteService,
    JwtAuthGuard,
  ],
  exports: [FavouritesRepository, FavouriteService],
})
export class FavouriteModule {}
