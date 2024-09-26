/*import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../../../../config/database';
import Subject from './Subject';
import Need from './Need';

class SubjectNeed extends Model {
  public subjectId!: number;
  public needId!: number;

  public static associations: {
    subject: BelongsTo<SubjectNeed, Subject>;
    need: BelongsTo<SubjectNeed, Need>;
  };
}

SubjectNeed.init({
  subjectId: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: 'id',
    },
    primaryKey: true,
  },
  needId: {
    type: DataTypes.INTEGER,
    references: {
      model: Need,
      key: 'id',
    },
    primaryKey: true,
  },
}, {
  sequelize,
  modelName: 'SubjectNeed',
  tableName: 'SubjectNeeds',
  timestamps: false,
});

export default SubjectNeed;
*/