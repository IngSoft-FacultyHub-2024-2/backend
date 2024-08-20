import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class SubjectPrize extends Model {
  public id!: number;
  public subject_id!: number;
  public prize_id!: number;
}

SubjectPrize.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  prize_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'SubjectPrize',
  tableName: 'SubjectPrizes',
  timestamps: true,
});

export default SubjectPrize;
