import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { InitModule } from './init_data/init.module';
import { FavouriteModule } from './favourites/favourite.module';
import { OrdersModule } from './orders/orders.module';
import { SortModule } from './sort/sort.module';
import { SyteRatingModule } from './Syte_rating/syte_rating.module';
import { RatesModule } from './rates/rates.module';

import { SyteRating } from './models/SyteRating';
import { Products } from './models/products.model';
import { Ratings } from './models/ratings.model';
import { Orders } from './models/orders.model';
import { Favourites } from './models/favourites.model';
import { UserRoles } from './models/userroles.model';
import { Roles } from './models/roles.model';
import { Users } from './models/users.model';
import { Categories } from './models/categories.model';
import { GmailModule } from './Gmail/gmail.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'passw',
      database: process.env.DB_NAME || 'postgres',
      define: {
        underscored: true,
      },
      models: [
        Users,
        Roles,
        UserRoles,
        Favourites,
        Orders,

        Categories,
        Ratings,
        SyteRating,
        Products,
      ],
    }),
    GmailModule,
    UsersModule,
    RolesModule,
    FavouriteModule,
    OrdersModule,

    InitModule,
    RatesModule,
    SortModule,
    SyteRatingModule,
  ],
})
export class AppModule {}
