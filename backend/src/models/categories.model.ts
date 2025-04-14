import { DataTypes } from 'sequelize';
import {
  Column,
  CreatedAt,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  HasMany,
  AutoIncrement,
} from 'sequelize-typescript';
import { Products } from './products.model';

@Table
export class Categories extends Model<Categories> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  category_id!: number;

  @Column(DataTypes.STRING(25))
  name!: string;

  @Column(DataTypes.STRING(1000))
  description!: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at!: Date;

  @HasMany(() => Products)
  products!: Products[];
}
