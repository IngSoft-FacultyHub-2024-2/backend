import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../../config/database';

'use strict';

class TeacherSubjectGroup extends Model {
  public id!: number;
  public subject_id!: number;
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
