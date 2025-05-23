import { BelongsToMany, DataTypes, HasMany, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import Benefit from './Benefit';
import Teacher from './Teacher';

class TeacherBenefit extends Model {
  public id!: number;
  public teacher_id!: number;
  public benefit_id!: number;
  public date!: Date;

  public static associations: {
    teacher: BelongsToMany<TeacherBenefit, Teacher>;
    benefit: HasMany<TeacherBenefit, Benefit>;
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
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'TeacherBenefit',
  tableName: 'TeacherBenefits',
  timestamps: true,
});

export default TeacherBenefit;
