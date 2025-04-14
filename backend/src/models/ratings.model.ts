  import { DataTypes } from 'sequelize';
  import {
    AutoIncrement,
    Column,
    CreatedAt,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
  } from 'sequelize-typescript';
  import { Products } from './products.model';
  import { Users } from './users.model';

  @Table
  export class Ratings extends Model<Ratings> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataTypes.INTEGER)
    rating_id!: number;

    @ForeignKey(() => Users)
    @Column(DataTypes.INTEGER)
    user_id!: number;

    @ForeignKey(() => Products)
    @Column(DataTypes.INTEGER)
    product_id!: number;

    @Default(0) // Потом @Default
    @Column({ type: DataTypes.INTEGER, allowNull: false }) // Сначала @Column
    rating!: number;

    @Column(DataTypes.TEXT)
    comment!: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at!: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at!: Date;
  }
