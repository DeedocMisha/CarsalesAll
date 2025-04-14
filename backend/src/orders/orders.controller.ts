import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { SendOrderDto } from './dto/SendOrderDto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('getOrderById/:Id')
  getOrderById(@Param('Id') Id: number) {
    return this.ordersService.getOrderById(Id);
  }

  @Get('getAllOrders')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Post('createOrder')
  createOrder(@Body() sendOrderDto: SendOrderDto) {
    return this.ordersService.createOrder(sendOrderDto);
  }

  @Delete('deleteOrder')
  deleteOrder(@Body() { order_Id }: { order_Id: number }) {
    return this.ordersService.deleteOrder(order_Id);
  }
}
