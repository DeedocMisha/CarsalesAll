import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { UserService } from './users.service';
import { ValidateUserDto } from './dto/ValidateUserDto';
import { JwtAuthGuard } from './JwtAuthGuard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { postBalanceDto } from './dto/setBalance.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post('register')
  async create(@Body() userDto: CreateUserDto) {
    return this.usersService.register(userDto);
  }

  @Post('login')
  async login(@Body() userDto: ValidateUserDto) {
    return this.usersService.login(userDto);
  }

  @Post('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async DoUserAdmin(@Param('id') id: number) {
    return this.usersService.DoAdmin(id);
  }

  @Get('GetBalance/:userid')
  async getBalance(@Param('userid') userid: number) {
    return this.usersService.getBalance(userid);
  }

  @Post('PostBalance')
  async setBalance(@Body() userDto: postBalanceDto) {
    return this.usersService.setBalance(userDto);
  }
}
