import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Products } from '../models/products.model';
import { SendProductDto } from './dto/send.product.dto';
import { Orders } from 'src/models/orders.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products) private readonly productsTable: typeof Products,
    @InjectModel(Orders) private readonly ordersTable: typeof Orders,
  ) {}
  async getAllProducts() {
    try {
      const res = await this.productsTable.findAll();
      for (const prod of res) {
        if (prod.stock_quantity < 1) {
          await this.deleteProduct(prod.product_id);
        }
      }
      return await this.productsTable.findAll();
    } catch (error) {
      console.error('Ошибка получения всех товаров:', error);
      return {
        message: 'Ошибка получения всех товаров',
        error: error.message || error,
      };
    }
  }

  // Получить информацию о товаре по его ID
  async getProductById(Id: number) {
    try {
      const product = await this.productsTable.findOne({
        where: { product_id: Id },
      });

      if (!product) {
        return { message: 'Товар не найден' };
      }

      return product;
    } catch (error) {
      console.error('Ошибка получения товара по ID:', error);
      return {
        message: 'Ошибка получения товара',
        error: error.message || error,
      };
    }
  }

  async sentProducts(sendProductDto: SendProductDto) {
    try {
      const product = await this.productsTable.create(sendProductDto);
      return { message: 'Товар успешно создан', product };
    } catch (error) {
      console.error('Ошибка создания товара:', error);
      return {
        message: 'Ошибка создания товара',
        error: error.message || error,
      };
    }
  }

  // Удалить товар
  async deleteProduct(product_Id: number) {
    try {

      // Удаляем сам продукт
      await this.productsTable.destroy({ where: { product_id: product_Id } });

      return { message: 'Товар и связанные заказы удалены' };
    } catch (error) {
      console.error('Ошибка удаления товара:', error);
      return { message: 'Ошибка удаления товара', error: error.message };
    }
  }
}
