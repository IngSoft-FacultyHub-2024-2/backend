import { BelongsToMany, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import { WeekDays } from '../../../../shared/utils/enums/WeekDays';
import Module from './Module';
import Teacher from './Teacher';

class TeacherAvailableModule extends Model {
  public id!: number;
  public teacher_id!: number;
  public day_of_week!: string; 
  public module_id!: number; 

  public static associations: {
    teacher: BelongsToMany<TeacherAvailableModule, Teacher>;
    module: BelongsToMany<TeacherAvailableModule, Module>;
  };
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
  module_id: {
    type: DataTypes.INTEGER, // Value between 1 and 14
    allowNull: false,
    references: {
      model: 'Modules',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'TeacherAvailableModule',
  tableName: 'TeacherAvailableModules',
  timestamps: true,
});

export default TeacherAvailableModule;
