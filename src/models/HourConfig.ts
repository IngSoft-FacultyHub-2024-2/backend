import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../config/database';
import Subject from './Subject';

class HourConfig extends Model {
  public id!: number;
  public subject_id!: number;
  public role!: 'Teorico' | 'Tecnología';
  public total_hours!: number;
  public weekly_hours!: number;

  public static associations: {
    subject: BelongsTo<HourConfig, Subject>;
  };
}

HourConfig.init({
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
  role: {
    type: DataTypes.ENUM('Teorico', 'Tecnología'),
    allowNull: false,
  },
  total_hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  weekly_hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'HourConfig',
  tableName: 'HourConfigs',
  timestamps: true,
});

HourConfig.belongsTo(Subject, {
    foreignKey: 'subject_id',
    as: 'subject',
  });

export default HourConfig;
