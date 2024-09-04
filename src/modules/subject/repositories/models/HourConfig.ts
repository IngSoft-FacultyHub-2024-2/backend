import { Model, DataTypes, BelongsTo, Association  } from 'sequelize';
import sequelize from '../../../../config/database';
import Subject from './Subject';
import { TeacherRoles } from '../../../../shared/utils/teacherRoles';

// TODO: change possible roles as a table
 
class HourConfig extends Model {
  public id!: number;
  public subject_id!: number;
  public role!: TeacherRoles.TECHNOLOGY | TeacherRoles.THEORY
  public total_hours!: number;
  public weekly_hours!: number;

  public static associations: {
    subject: Association<HourConfig, Subject>;
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
    type: DataTypes.ENUM(TeacherRoles.TECHNOLOGY, TeacherRoles.THEORY),
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

export default HourConfig;
