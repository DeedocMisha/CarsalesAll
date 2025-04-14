import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { JwtModule } from '@nestjs/jwt';
import { Roles } from '../models/roles.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [JwtModule, SequelizeModule.forFeature([Roles])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService, SequelizeModule], // Export RolesService here
})
export class RolesModule {}
