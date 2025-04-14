import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Orders } from '../models/orders.model';
import { Users } from '../models/users.model';
import { Products } from '../models/products.model';
import { SendOrderDto } from './dto/SendOrderDto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders) private readonly ordersTable: typeof Orders,
    @InjectModel(Users) private readonly usersTable: typeof Users,
    @InjectModel(Products) private readonly productsTable: typeof Products,
  ) {}

  async getOrderById(Id: number) {
    try {
      const orders = await this.ordersTable.findAll({
        where: { user_id: Id },
        raw: true
      });



      // Для каждого заказа получаем товар
      const products = await Promise.all(
        orders.map(order =>
          this.productsTable.findOne({
            where: { product_id: order.product_id },
            raw: true
          })
        )
      );

      return products.filter(Boolean); // Убираем возможные null
    } catch (error) {
      console.error('Ошибка извлечения заказа', error);
      throw error;
    }
  }

  async getAllOrders() {
    try {
      return await this.ordersTable.findAll();
    } catch (error) {
      console.error('Ошибка получения списка заказов', error);
      return { message: 'Ошибка получения списка заказов' };
    }
  }

  async createOrder(sendOrderDto: SendOrderDto) {
    const transaction = await this.ordersTable.sequelize.transaction();
    try {
      const product = await this.productsTable.findOne({
        where: { product_id: sendOrderDto.product_id },
        transaction,
      });

      if (!product) {
        throw new Error(`Product with ID ${sendOrderDto.product_id} not found`);
      }


      if (product.price !== sendOrderDto.amount) {
        throw new Error(
          `Price mismatch. Expected: ${product.price}, Received : ${sendOrderDto.amount}`,
        );
      }

      const user = await this.usersTable.findOne({
        where: { user_id: sendOrderDto.userId },
        transaction,
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.balance < product.price) {
        throw new Error(
          `Insufficient funds. Your balance: ${user.balance}, Required: ${product.price}`,
        );
      }

      if (product.stock_quantity < 1) {
        throw new Error('This product is out of stock');
      }

      // Update user balance
      await this.usersTable.update(
        { balance: user.balance - product.price },
        {
          where: { user_id: user.user_id },
          transaction,
        },
      );

      // Update product stock
      await this.productsTable.update(
        { stock_quantity: product.stock_quantity - 1 },
        {
          where: { product_id: product.product_id },
          transaction,
        },
      );

      // Create the order record
      const order = await this.ordersTable.create(
        {
          user_id: sendOrderDto.userId,
          product_id: sendOrderDto.product_id,
        },
        { transaction },
      );

      await transaction.commit(); 
      return order;
    } catch (error) {
      await transaction.rollback();
      console.error('Order creation failed:', error);
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  async deleteOrder(order_Id: number) {
    try {
      const deletedCount = await this.ordersTable.destroy({
        where: { order_id: order_Id },
      });
      if (deletedCount === 0) {
        return { message: 'Заказ не найден' };
      }
      return { message: 'Заказ успешно удален' };
    } catch (error) {
      console.error('Ошибка удаления заказа', error);
      return {
        message: 'Ошибка удаления заказа',
        error: error.message || error,
      };
    }
  }
}
