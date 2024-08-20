import { Model, DataTypes, BelongsTo, HasOne } from 'sequelize';
import sequelize from '../config/database';
import Teacher from './Teacher';
import Category from './Category';

class TeacherCategory extends Model {
  public id!: number;
  public teacher_id!: number;
  public category_id!: number;

  public static associations: {
    teacher: BelongsTo<TeacherCategory, Teacher>;
    category: HasOne<TeacherCategory, Category>;
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

TeacherCategory.belongsTo(Teacher, {
  foreignKey: 'teacher_id',
  as: 'teacher',
});

TeacherCategory.hasOne(Category, {
  foreignKey: 'category_id',
  as: 'category',
});

export default TeacherCategory;
