import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../users/JwtAuthGuard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller("roles")
export class RolesController {
  constructor(private readonly rolesservise: RolesService) {}


  @Get("GetAllRoles")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  GetAllRoles(): any {
    return this.rolesservise.getRoles();
  }
}
