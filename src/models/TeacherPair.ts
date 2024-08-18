import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../config/database';
import Subject from './Subject';
import Teacher from './Teacher';

class TeacherPair extends Model {
  public id!: number;
  public id_subject!: number;
  public id_teacher_1!: number;
  public id_teacher_2!: number;
  public role_teacher_1!: 'Teorico' | 'Tecnología';
  public role_teacher_2!: 'Teorico'
  public start_date!: Date;
  public end_date!: Date | null;

  public static associations: {
    subject: BelongsTo<TeacherPair, Subject>;
    teacher_1: BelongsTo<TeacherPair, Teacher>;
    teacher_2: BelongsTo<TeacherPair, Teacher>;
  };
}

TeacherPair.init({
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
  id_teacher_1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Teachers',
      key: 'id',
    },
  },
  id_teacher_2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Teachers',
      key: 'id',
    },
  },
  role_teacher_1: {
    type: DataTypes.ENUM('Teorico', 'Tecnología'),
    allowNull: false,
  },
  role_teacher_2: {
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
  modelName: 'TeacherPair',
  tableName: 'TeacherPairs',
  timestamps: true,
});

TeacherPair.belongsTo(Subject, {
  foreignKey: 'id_subject',
  as: 'subject',
});

TeacherPair.belongsTo(Teacher, {
  foreignKey: 'id_teacher_1',
  as: 'teacher_1',
});

TeacherPair.belongsTo(Teacher, {
  foreignKey: 'id_teacher_2',
  as: 'teacher_2',
});

export default TeacherPair;
