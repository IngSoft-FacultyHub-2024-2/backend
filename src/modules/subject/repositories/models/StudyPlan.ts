import { Model, DataTypes, HasMany, BelongsToMany } from 'sequelize';
import sequelize from '../../../../config/database';
import Subject from './Subject';


class StudyPlan extends Model {
  public id!: number;
  public year!: number;
  public valid!: boolean;

  public static associations: {
    subjects: HasMany<StudyPlan, Subject>;
  };
}

StudyPlan.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  valid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  sequelize,
  modelName: 'StudyPlan',
  tableName: 'StudyPlans',
});

StudyPlan.hasMany(Subject, {
    foreignKey: 'study_plan_id',
    as: 'subjects',
});

Subject.belongsTo(StudyPlan, {
    foreignKey: 'study_plan_id',
    as: 'study_plan',
});

export default StudyPlan;