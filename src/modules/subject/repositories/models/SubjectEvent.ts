import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../../../../config/database';
import Subject from './Subject';
import Event from './Event';

class SubjectEvent extends Model {
  public subjectId!: number;
  public eventId!: number;
  public description!: string;

  public static associations: {
    subject: BelongsTo<SubjectEvent, Subject>;
    event: BelongsTo<SubjectEvent, Event>;
  };
}

SubjectEvent.init({
  subjectId: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: 'id',
    },
    primaryKey: true,
  },
  eventId: {
    type: DataTypes.INTEGER,
    references: {
      model: Event,
      key: 'id',
    },
    primaryKey: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'SubjectEvent',
  tableName: 'SubjectEvents',
  timestamps: false,
});


export default SubjectEvent;
