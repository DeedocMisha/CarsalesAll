import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { SendProductDto } from './dto/send.product.dto';
import { RolesGuard } from '../roles/roles.guard';
import { JwtAuthGuard } from 'src/users/JwtAuthGuard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('GetProdById/:product_Id')
  getProductById(@Param('product_Id') product_Id: string) {
    return this.productsService.getProductById(Number(product_Id));
  }

  @Get('GetAllProducts')
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Post('SetProduct')
  createProduct(@Body() sendProductDto: SendProductDto) {
    return this.productsService.sentProducts(sendProductDto);
  }

  @Delete('DeleteProduct/:product_Id')
  deleteProduct(@Param('product_Id') product_Id: string) {
    return this.productsService.deleteProduct(Number(product_Id));
  }
}
