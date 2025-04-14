import { DataTypes } from 'sequelize';
import {
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Roles } from './roles.model';
import { UserRoles } from './userroles.model';

@Table
export class Users extends Model<Users> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  user_id!: number;

  @Column(DataTypes.STRING(15))
  first_name!: string;

  @Column(DataTypes.STRING(20))
  last_name!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  balance: number;

  @Column(DataTypes.STRING(50))
  email!: string;

  @Column(DataTypes.STRING)
  password_hash!: string;

  @Column({ field: 'user_token' })
  userToken: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at!: Date;

  @BelongsToMany(() => Roles, () => UserRoles)
  roles!: Roles[];
}
