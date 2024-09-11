import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../../../../config/database';
import TeacherSubjectGroupMember from './TeacherSubjectGroupMember';

'use strict';

class TeacherSubjectGroup extends Model {
  public id!: number;
  public subject_id!: number;
  public members!: TeacherSubjectGroupMember[];

  public static associations: {
    members: BelongsTo<TeacherSubjectGroup, TeacherSubjectGroupMember>;
  };
}

TeacherSubjectGroup.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'TeacherSubjectGroup',
  tableName: 'TeacherSubjectGroups',
  timestamps: true,
});

export default TeacherSubjectGroup;
