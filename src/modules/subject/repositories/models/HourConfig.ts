import { Association, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import { SubjectRoles } from '../../../../shared/utils/enums/subjectRoles';
import Subject from './Subject';

// TODO: change possible roles as a table
 
class HourConfig extends Model {
  public id!: number;
  public subject_id!: number;
  public role!: SubjectRoles.TECHNOLOGY | SubjectRoles.THEORY
  public total_hours!: number;

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
    type: DataTypes.ENUM(SubjectRoles.TECHNOLOGY, SubjectRoles.THEORY),
    allowNull: false,
  },
  total_hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'HourConfig',
  tableName: 'HourConfigs',
  timestamps: true,
});

export default HourConfig;
