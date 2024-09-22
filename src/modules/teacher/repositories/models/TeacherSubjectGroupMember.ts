import { Model, DataTypes, BelongsToMany } from 'sequelize';
import sequelize from '../../../../config/database';
import Teacher from './Teacher';
import { TeacherRoles } from '../../../../shared/utils/teacherRoles';
import TeacherSubjectGroup from './TeacherSubjectGroup';

class TeacherSubjectGroupMember extends Model {
  public id!: number;
  public teacher_id!: number;
  public teacher_subject_group_id!: number;
  public role!: string;

  public static associations: {
    teacher: BelongsToMany<TeacherSubjectGroupMember, Teacher>;
    teacher_subject_group: BelongsToMany<TeacherSubjectGroupMember, TeacherSubjectGroup>;
  };
}

TeacherSubjectGroupMember.init({
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
      key: 'id'
    },
    field: 'teacher_id',
  },
  teacher_subject_group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'TeacherSubjectGroups',
      key: 'id'
    },
    field: 'teacher_subject_group_id',
  },
  role: {
    type: DataTypes.ENUM(TeacherRoles.TECHNOLOGY, TeacherRoles.THEORY),
    allowNull: false
  }

}, {
  sequelize,
  modelName: 'TeacherSubjectGroupMember',
  tableName: 'TeacherSubjectGroupMembers',
  timestamps: true,
});

export default TeacherSubjectGroupMember;
