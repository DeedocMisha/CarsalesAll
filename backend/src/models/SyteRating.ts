import { DataTypes } from 'sequelize';
import {
  AutoIncrement,
  Column,
  CreatedAt,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { Users } from './users.model'; 

@Table({ tableName: 'syte_ratings' }) 
export class SyteRating extends Model<SyteRating> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  rating_id!: number;

  @ForeignKey(() => Users)
  @Column(DataTypes.INTEGER)
  user_id!: number;

  @Column(DataTypes.INTEGER)
  rating!: number;

  @Column(DataTypes.STRING)
  comment!: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at!: Date;
}