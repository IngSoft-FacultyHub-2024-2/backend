import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../../../../config/database';
import Teacher from './Teacher';

class TeacherSubjectOfInterest extends Model {
  public id!: number;
  public teacher_id!: number;
  public subject_id!: number;

  public static associations: {
    teacher: BelongsTo<TeacherSubjectOfInterest, Teacher>;
  };
}

TeacherSubjectOfInterest.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Teachers',
      key: 'id',
    },
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // references: {
    //   model: 'Subjects',
    //   key: 'id',
    // }
  }
}, {
  sequelize,
  modelName: 'TeacherSubjectOfInterest',
  tableName: 'TeacherSubjectOfInterests',
  timestamps: true,
});

export default TeacherSubjectOfInterest;
