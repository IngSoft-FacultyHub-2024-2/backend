import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../../config/database';

class TeacherAvailableModule extends Model {
  public id!: number;
  public teacher_id!: number;
  public day_of_week!: string; // 'Monday', 'Tuesday', etc.
  public module!: number; // e.g., 1, 2, 3, ..., 14 (total 14 modules in a day)
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
      model: 'Teachers', // Foreign key to Teacher model
      key: 'id',
    },
  },
  day_of_week: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
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
