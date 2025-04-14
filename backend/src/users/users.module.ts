import { Module } from '@nestjs/common';
import { RolesModule } from '../roles/roles.module'; // Импортируем модуль, а не сервис
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './JwtAuthGuard';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from '../models/users.model';
import { RolesService } from '../roles/roles.service';
import { RolesGuard } from '../roles/roles.guard';
import { ProductsModule } from '../products/products.module';
import { FavouriteModule } from '../favourites/favourite.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Users]),
    RolesModule,
    FavouriteModule,
    ProductsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'BestChange',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UserService, JwtAuthGuard, RolesGuard, RolesService], // Добавляем RolesService в providers
  exports: [RolesService, SequelizeModule], // Экспортируем только нужные сервисы/модули
})
export class UsersModule {}
