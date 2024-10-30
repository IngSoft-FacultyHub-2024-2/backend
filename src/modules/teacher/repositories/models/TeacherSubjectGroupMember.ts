import { BelongsTo, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import { SubjectRoles } from '../../../../shared/utils/enums/subjectRoles';
import Teacher from './Teacher';
import TeacherSubjectGroup from './TeacherSubjectGroup';

class TeacherSubjectGroupMember extends Model {
  public id!: number;
  public teacher_id!: number;
  public teacher_subject_group_id!: number;
  public role!: string;

  public static associations: {
    teacher: BelongsTo<TeacherSubjectGroupMember, Teacher>;
    teacher_subject_group: BelongsTo<
      TeacherSubjectGroupMember,
      TeacherSubjectGroup
    >;
  };
}

TeacherSubjectGroupMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Teacher',
        key: 'id',
      },
      field: 'teacher_id',
    },
    teacher_subject_group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TeacherSubjectGroup',
        key: 'id',
      },
      field: 'teacher_subject_group_id',
    },
    role: {
      type: DataTypes.ENUM(SubjectRoles.TECHNOLOGY, SubjectRoles.THEORY),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TeacherSubjectGroupMember',
    tableName: 'TeacherSubjectGroupMembers',
    timestamps: true,
  }
);

export default TeacherSubjectGroupMember;
