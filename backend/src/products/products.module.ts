// products.module.ts
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Products } from '../models/products.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Orders } from 'src/models/orders.model';
import { Favourites } from '../models/favourites.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([Products, Orders]),
    SequelizeModule.forFeature([Favourites]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'BestChange',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
