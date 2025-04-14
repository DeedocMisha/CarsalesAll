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
    import { DataTypes } from 'sequelize';
    import { Users } from './users.model';
    import { Products } from './products.model';

    @Table({ tableName: 'favourites', timestamps: true })
  export class Favourites extends Model<Favourites> {
    @PrimaryKey 
    @AutoIncrement
    @Column(DataTypes.INTEGER)
    favourite_id!: number;

    @ForeignKey(() => Users)
    @Column(DataTypes.INTEGER)
    user_id!: number;

    @ForeignKey(() => Products)
    @Column(DataTypes.INTEGER)
    product_id!: number;

    @CreatedAt
    @Column(DataTypes.DATE)
    created_at!: Date;

    @UpdatedAt
    @Column(DataTypes.DATE)
    updated_at!: Date;

  }