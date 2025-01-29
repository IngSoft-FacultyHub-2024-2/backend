import { DataTypes, HasOne, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import Teacher from '../../../teacher/repositories/models/Teacher';
import Permission from './Permission';
import Role from './Role';
import RolePermission from './RolePermission';

class User extends Model {
  public id!: number;
  public teacher_id!: number;
  public teacher_employee_number!: number;
  public password!: string;
  public is_active!: boolean;
  public role_id!: number;

  public static associations: {
    role: HasOne<User, Role>;
    teacher: HasOne<User, Teacher>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Teachers',
        key: 'id',
      },
    },
    teacher_employee_number: {
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
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  }
);

export default User;

Role.hasMany(User, {
  foreignKey: 'role_id',
  as: 'users',
});

User.hasOne(Role, {
  foreignKey: 'role_id',
  as: 'role',
});

Teacher.hasOne(User, {
  foreignKey: 'teacher_id',
  as: 'user',
});

User.belongsTo(Teacher, {
  foreignKey: 'teacher_id',
  as: 'teacher',
});

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'role_id',
  as: 'permissions',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permission_id',
  as: 'roles',
});
