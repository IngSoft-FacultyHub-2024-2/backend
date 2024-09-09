import { Model, DataTypes, BelongsToMany } from 'sequelize';
import sequelize from '../../../../config/database';
import Teacher from './Teacher';
import Category from './Category';

class TeacherCategory extends Model {
  public id!: number;
  public teacher_id!: number;
  public category_id!: number;

  public static associations: {
    teacher: BelongsToMany<TeacherCategory, Teacher>;
    category: BelongsToMany<TeacherCategory, Category>;
  };
}

TeacherCategory.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'TeacherCategory',
  tableName: 'TeacherCategories',
  timestamps: true,
});

export default TeacherCategory;
