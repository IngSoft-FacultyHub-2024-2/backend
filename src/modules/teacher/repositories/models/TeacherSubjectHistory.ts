import { BelongsTo, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import { SubjectRoles } from '../../../../shared/utils/enums/subjectRoles';
import Teacher from './Teacher';

class TeacherSubjectHistory extends Model {
  public id!: number;
  public teacher_id!: number;
  public subject_id!: number;
  public role!: string;
  public start_date!: Date;
  public end_date!: Date | null;

  public static associations: {
    teacher: BelongsTo<TeacherSubjectHistory, Teacher>;
  };
}

TeacherSubjectHistory.init({
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
    // },
  },
  role: {
    type: DataTypes.ENUM(SubjectRoles.TECHNOLOGY, SubjectRoles.THEORY),
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

export default TeacherSubjectHistory;
