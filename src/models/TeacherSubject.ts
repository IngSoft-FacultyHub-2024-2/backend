import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../config/database';
import Teacher from './Teacher';
import Subject from './Subject';

class TeacherSubject extends Model {
  public id!: number;
  public id_subject!: number;
  public id_teacher!: number;
  public role!: 'Teorico' | 'Tecnología';
  public start_date!: Date;
  public end_date!: Date | null;

  public static associations: {
    teacher: BelongsTo<TeacherSubject, Teacher>;
    subject: BelongsTo<TeacherSubject, Subject>;
  };
}

TeacherSubject.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_subject: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Subjects',
      key: 'id',
    },
  },
  id_teacher: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Teachers',
      key: 'id',
    },
  },
  role: {
    type: DataTypes.ENUM('Teorico', 'Tecnología'),
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'TeacherSubject',
  tableName: 'TeacherSubjects',
  timestamps: true,
});

TeacherSubject.belongsTo(Teacher, {
  foreignKey: 'id_teacher',
  as: 'teacher',
});

TeacherSubject.belongsTo(Subject, {
  foreignKey: 'id_subject',
  as: 'subject',
});

export default TeacherSubject;
