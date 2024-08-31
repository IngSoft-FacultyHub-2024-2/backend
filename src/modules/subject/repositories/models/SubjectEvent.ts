import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../../config/database';
import Subject from './Subject';
import Event from './Event';

class SubjectEvent extends Model {
  public subjectId!: number;
  public eventId!: number;
  public description!: string;
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

Event.belongsToMany(Subject, {
    through: SubjectEvent,
    foreignKey: 'eventId',
    otherKey: 'subjectId',
    as: 'subjects', 
  });

export default SubjectEvent;
