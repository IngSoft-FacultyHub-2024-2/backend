import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../../../../config/database';

class Benefit extends Model {
  public id!: number;
  public name!: string;
}

Benefit.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Benefit',
  tableName: 'Benefits',
  timestamps: true,
});

export default Benefit;
