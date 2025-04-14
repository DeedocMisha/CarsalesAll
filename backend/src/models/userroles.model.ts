import { DataTypes } from 'sequelize';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Roles } from './roles.model';
import { Users } from './users.model';

@Table
export class UserRoles extends Model<UserRoles> {
  @ForeignKey(() => Users)
  @Column(DataTypes.INTEGER)
  user_id!: number;

  @ForeignKey(() => Roles)
  @Column(DataTypes.INTEGER)
  role_id!: number;
}     
