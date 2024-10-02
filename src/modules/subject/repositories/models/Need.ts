import { Model, DataTypes, BelongsToMany } from 'sequelize';
import sequelize from '../../../../config/database';
import Subject from './Subject';

class Need extends Model {
  public id!: number;
  public name!: string;

  public static associations: {
    subjects: BelongsToMany<Need, Subject>;
  };
}

Need.init({
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
  modelName: 'Need',
  tableName: 'Needs',
  timestamps: true,
});

export default Need;
