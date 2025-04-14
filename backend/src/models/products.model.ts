import { DataTypes } from 'sequelize';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Categories } from './categories.model';

@Table
export class Products extends Model<Products> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  product_id!: number;

  @Column(DataTypes.STRING(15))
  name!: string;

  @Column(DataTypes.STRING)
  fuel_type : string; 

  @Column(DataTypes.INTEGER)
  speed: number;

  @Column(DataTypes.INTEGER)
  mileage: number;

  @Column(DataTypes.INTEGER)
  owner_count: number;

  @Column(DataTypes.INTEGER)
  rating: number;

  @Column(DataTypes.STRING)
  description!: string;

  @Column(DataTypes.DOUBLE)
  price!: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at!: Date;

  @Column(DataTypes.INTEGER)
  stock_quantity!: number;

  @ForeignKey(() => Categories)
  @Column(DataTypes.INTEGER)
  category_id!: number;

  @BelongsTo(() => Categories)
  category!: Categories;

  @Column(DataTypes.STRING)
  image_url!: string;
}
