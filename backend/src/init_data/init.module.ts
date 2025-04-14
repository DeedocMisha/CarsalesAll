import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { InitService } from './init.service';
import { Users } from '../models/users.model';
import { Roles } from '../models/roles.model';
import { Products } from '../models/products.model';
import { Categories } from '../models/categories.model';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    SequelizeModule.forFeature([Users, Roles, Products, Categories]), // Добавил модели в SequelizeModule
  ],
  providers: [InitService],
})
export class InitModule {}
