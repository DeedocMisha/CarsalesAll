import {
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Products } from './products.model';
import { Users } from './users.model';

@Table
export class Orders extends Model<Orders> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  order_id!: number;

  @ForeignKey(() => Users)
  @Column(DataTypes.INTEGER)
  user_id!: number;

  @ForeignKey(() => Products)
  @Column({ type: DataTypes.INTEGER, onDelete: 'CASCADE' })
  product_id!: number;
  
}