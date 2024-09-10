import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../../config/database';
import { WeekDays } from '../../../../shared/utils/WeekDays';

class TeacherAvailableModule extends Model {
  public id!: number;
  public teacher_id!: number;
  public day_of_week!: string; 
  public module!: number; 
}

TeacherAvailableModule.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Teachers', 
      key: 'id',
    },
  },
  day_of_week: {
    type: DataTypes.ENUM(WeekDays.MONDAY, WeekDays.TUESDAY, WeekDays.WEDNESDAY, WeekDays.THURSDAY, WeekDays.FRIDAY, WeekDays.SATURDAY, WeekDays.SUNDAY),
    allowNull: false,
  },
  module: {
    type: DataTypes.INTEGER, // Value between 1 and 14
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'TeacherAvailableModule',
  tableName: 'TeacherAvailableModules',
  timestamps: true,
});

export default TeacherAvailableModule;
