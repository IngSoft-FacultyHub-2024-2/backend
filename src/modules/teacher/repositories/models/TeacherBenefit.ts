import { Model, DataTypes, BelongsToMany } from 'sequelize';
import sequelize from '../../../../config/database';
import Teacher from './Teacher';
import Benefit from './Benefit';

class TeacherBenefit extends Model {
  public id!: number;
  public teacher_id!: number;
  public benefit_id!: number;

  public static associations: {
    teacher: BelongsToMany<TeacherBenefit, Teacher>;
    benefit: BelongsToMany<TeacherBenefit, Benefit>;
  };
}

TeacherBenefit.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  benefit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'TeacherBenefit',
  tableName: 'TeacherBenefits',
  timestamps: true,
});

export default TeacherBenefit;
