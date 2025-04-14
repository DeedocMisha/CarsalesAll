import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { Roles } from '../models/roles.model';
import { Users } from '../models/users.model';
import { Products } from '../models/products.model';
import { Categories } from '../models/categories.model';

@Injectable()
export class InitService implements OnModuleInit {
  constructor(
    @InjectModel(Roles)
    private readonly rolesModel: typeof Roles,
    @InjectModel(Users)
    private readonly usersModel: typeof Users,
    @InjectModel(Products)
    private readonly productsModel: typeof Products,
    @InjectModel(Categories)
    private readonly categoriesModel: typeof Categories,
  ) {}

  async onModuleInit() {
    const [adminRole] = await this.rolesModel.findOrCreate({
      where: { name: 'admin' },
      defaults: {
        name: 'admin',
        description: 'Administrator role',
      },
    });

    const [userRole] = await this.rolesModel.findOrCreate({
      where: { name: 'user' },
      defaults: {
        name: 'user',
        description: 'Regular user role',
      },
    });

    console.log('Roles initialized in the database:', { adminRole, userRole });

    const adminExists = await this.usersModel.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!adminExists) {
      console.log('Admin user not found. Creating...');

      const adminUser = await this.usersModel.create({
        first_name: 'adminUser',
        email: 'admin@example.com',
        password_hash: await bcrypt.hash('ADMINUSERROLES', 10),
      });

      await adminUser.$add('roles', [adminRole.role_id]);

      console.log('Admin user created successfully with roles.');
    } else {
      console.log('Admin user already exists.');
    }

    const [category] = await this.categoriesModel.findOrCreate({
      where: { name: 'Cars' },
      defaults: {
        name: 'Cars',
        description: 'Category for cars',
      },
    });

    const cars = [
      {
        name: 'Toyota Camry',
        description: 'Reliable midsize sedan with great fuel economy',
        price: 25000,
        stock_quantity: 15,
        fuel_type: 'Бензин',
        speed: 180,
        mileage: 50000,
        owner_count: 1,
        rating: 4,
        category_id: category.category_id,
        image_url: 'https://i.ytimg.com/vi/zUacCKXNe1U/sddefault.jpg',
      },
      {
        name: 'Honda Civic',
        description: 'Compact car known for its reliability',
        price: 22000,
        stock_quantity: 12,
        fuel_type: 'Гибрид',
        speed: 190,
        mileage: 30000,
        owner_count: 1,
        rating: 5,
        category_id: category.category_id,
        image_url:
          'https://cdn.fishki.net/upload/post/2024/03/04/4595613/fcbb2fd0a53db22b5698091db3e62ac9.jpg',
      },
      {
        name: 'Tesla Model 3',
        description: 'Electric vehicle with autopilot features',
        price: 45000,
        stock_quantity: 8,
        fuel_type: 'Электро',
        speed: 250,
        mileage: 10000,
        owner_count: 1,
        rating: 3,
        category_id: category.category_id,
        image_url: 'https://kuban24.tv/wp-content/uploads/2024/10/jyjy.jpg',
      },
    ];

    for (const car of cars) {
      console.log('Processing car:', car);

      const productExists = await this.productsModel.findOne({
        where: { name: car.name },
      });

      if (!productExists) {
        console.log(`Creating product: ${car.name}`);
        await this.productsModel.create(car);
      } else {
        console.log(`Product ${car.name} already exists.`);
      }
    }

    console.log('All default products seeded successfully.');
  }
}
