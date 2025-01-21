import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../config/database';

class Role extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
}

Role.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'Roles',
    timestamps: true,
  }
);

export default Role;
