import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../config/database';

class Permission extends Model {
  public id!: number;
  public name!: string;
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Permission',
    tableName: 'Permissions',
    timestamps: true,
  }
);

export default Permission;
