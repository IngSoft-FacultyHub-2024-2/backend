import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../../config/database';

class Category extends Model {
  public id!: number;
  public name!: string;
}

Category.init({
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
  modelName: 'Category',
  tableName: 'Categories',
  timestamps: true,
});

export default Category;
