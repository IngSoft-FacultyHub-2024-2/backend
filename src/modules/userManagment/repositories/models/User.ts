import { DataTypes, HasOne, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import Permission from './Permission';
import Role from './Role';
import RolePermission from './RolePermission';

class User extends Model {
  public id!: number;
  public teacherId!: number;
  public password!: string;
  public is_active!: boolean;
  public roleId!: number;

  public static associations: {
    role: HasOne<User, Role>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  }
);

export default User;

User.hasOne(Role, {
  foreignKey: 'roleId',
  as: 'role',
});
Role.belongsTo(User, {
  foreignKey: 'roleId',
  as: 'user',
});

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
  as: 'permissions',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  as: 'roles',
});
