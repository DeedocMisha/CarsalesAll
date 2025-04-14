import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { CreateFavouriteDto } from './dto/CreateFavourite.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { JwtAuthGuard } from 'src/users/JwtAuthGuard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('favourites')
export class FavouritesController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Post('createFavourite')
  CreateFavourite(@Body() createFavouriteDto: CreateFavouriteDto) {
    return this.favouriteService.createFavourite(createFavouriteDto);
  } 

  @Get('getFavouritesFromUser/:userId')
  GetFavouritesFromUser(@Param('userId') userId: number) {
    return this.favouriteService.getFavouritesFromUser(userId);
  }

  @Delete('deleteFavourite')
  DeleteFavourite(@Body() createFavouriteDto: CreateFavouriteDto) {
    return this.favouriteService.deleteFavourite(createFavouriteDto);
  }

  @Get('getAllFavourites')
  GetAllFavouritesFromUser() {
    return this.favouriteService.getAllFavourites();
  }
}
