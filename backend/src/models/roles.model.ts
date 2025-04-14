import { DataTypes } from 'sequelize';
import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
@Table({ tableName: 'roles', schema: 'public' }) // Explicitly set table name
export class Roles extends Model<Roles> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER, // Ensure this is INTEGER
  })
  role_id: number;

  @Column(DataTypes.STRING(15))
  name!: string;

  @Column(DataTypes.STRING(100))
  description!: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at!: Date;
}