import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../../../../config/database';
import Subject from './Subject';

class Need extends Model {
  public id!: number;
  public subject_id!: number;
  public name!: string;

  public static associations: {
    subject: BelongsTo<Need, Subject>;
  };
}

Need.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Subjects',
      key: 'id',
    },
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
