import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Orders } from '../models/orders.model';
import { Products } from 'src/models/products.model';
import { Users } from 'src/models/users.model';

@Module({
  imports: [SequelizeModule.forFeature([Orders, Products, Users])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [SequelizeModule],
})
export class OrdersModule {}
