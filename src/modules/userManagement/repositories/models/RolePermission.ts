import { DataTypes, HasMany, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import Permission from './Permission';
import Role from './Role';

class RolePermission extends Model {
  public id!: number;
  public role_id!: number;
  public permission_id!: number;

  public static associations: {
    role: HasMany<RolePermission, Role>;
    permission: HasMany<RolePermission, Permission>;
  };
}

RolePermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Permissions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'RolePermission',
    tableName: 'RolePermissions',
    timestamps: true,
  }
);

export default RolePermission;
