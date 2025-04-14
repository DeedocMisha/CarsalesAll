import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './JWT.payload.interface';
import { ValidateUserDto } from './dto/ValidateUserDto';
import { Users } from '../models/users.model';
import { Roles } from '../models/roles.model';
import { UserRoles } from '../models/userroles.model';
import * as argon2 from 'argon2';
import { ProductsService } from '../products/products.service';
import { FavouritesRepository } from '../favourites/favouritesRepository';
import { postBalanceDto } from './dto/setBalance.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
    private readonly productsService: ProductsService,
    private readonly favouritesRepository: FavouritesRepository,
  ) {}

  async login(validateUserDto: ValidateUserDto) {
    const user = await this.validateUser(validateUserDto);
    const token = this.generateToken(user);

    await user.update({ userToken: token.token });

    return token;
  }

  async getBalance(userId: number) {
    try {
      const user = await this.findOne({ where: { user_id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return { balance: user.balance };
    } catch (error) {
      console.error(`Error while fetching balance: ${error}`);
      throw new HttpException(
        'Failed to fetch user balance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setBalance(PostBalanceDto: postBalanceDto) {
    try {
      const user = await this.findOne({
        where: { user_id: PostBalanceDto.UserId },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Преобразуем балансы в числа и округляем до целых
      const currentBalance = Math.round(Number(user.balance) * 100); // Умножаем на 100 для работы с копейками
      const addedBalance = Math.round(Number(PostBalanceDto.balance)) * 100;

      // Складываем как целые числа
      const newBalanceInCents = currentBalance + addedBalance;

      // Делим на 100 для получения правильного формата
      const newBalance = newBalanceInCents / 100;

      await user.update({ balance: newBalance });

      return { balance: newBalance.toFixed(2) }; // Возвращаем с 2 знаками после запятой
    } catch (error) {
      console.error(`Error while updating balance: ${error}`);
      throw new HttpException(
        'Failed to update user balance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async register(createUserDto: CreateUserDto) {
    const existingUser = await Users.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await argon2.hash(createUserDto.password);
    const user = await Users.create({
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email: createUserDto.email,
      password_hash: hashedPassword,
    });

    await this.assignDefaultRole(user.user_id);
    const token = this.generateToken(user);
    await user.update({ userToken: token.token }); // Update the existing user, don't create a new one
    return token;
  }

  private async assignDefaultRole(user_Id: number) {
    const defaultRole = await this.rolesService.findOne({
      where: { name: 'user' },
    });
    if (!defaultRole) {
      throw new HttpException('Default role not found', HttpStatus.BAD_REQUEST);
    }

    await UserRoles.create({ user_id: user_Id, role_id: defaultRole.role_id });
    return defaultRole;
  }

  private generateToken(user: Users): { token: string } {
    const payload: JwtPayload = {
      Id: user.user_id,
      first_name: user.first_name,
      roles: user.roles ? user.roles.map((role) => role.name) : [],
    };
    return { token: this.jwtService.sign(payload, { expiresIn: '1h' }) };
  }

  private async validateUser(validateUserDto: ValidateUserDto) {
    try {
      const user = await Users.findOne({
        where: { email: validateUserDto.email },
        include: [{ model: Roles }],
      });

      if (!user) {
        throw new HttpException(
          'Incorrect email or password',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const passwordMatches = await argon2.verify(
        user.password_hash,
        validateUserDto.password,
      );
      if (!passwordMatches) {
        throw new HttpException(
          'Incorrect email or password',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return user;
    } catch (error) {
      console.error(`Error while validating user: ${error}`);
      throw new HttpException(
        'Failed to validate user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async DoAdmin(Id: number) {
    const user = await this.findOne({ where: { user_id: Id } });

    const role = await this.rolesService.findOne({ where: { name: 'admin' } });
    if (!role) {
      throw new HttpException('Admin role not found', HttpStatus.NOT_FOUND);
    }

    await user.$add('roles', role.role_id);
    return { message: 'Role assigned successfully' };
  }

  async findOne(options): Promise<Users> {
    const user = await Users.findOne(options);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async like(UserId: number, ProductId: number) {
    const user = await this.findOne({ where: { user_id: UserId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const product = await this.productsService.getProductById(ProductId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const existingFavourite = await this.favouritesRepository.findOne({
      where: { user_id: UserId, product_id: ProductId },
    });

    if (existingFavourite) {
      return { message: 'This product is already in favourites' };
    }

    const favourite = await this.favouritesRepository.create({
      user_id: UserId,
      product_id: ProductId,
    });
    await favourite.save();

    return { message: 'Product added to favourites', favourite };
  }
}
