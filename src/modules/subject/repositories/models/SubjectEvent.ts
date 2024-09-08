import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../../../../config/database';
import Subject from './Subject';
import Event from './Event';

class SubjectEvent extends Model {
  public id!: number;
  public subject_id!: number;
  public event_id!: number;
  public description!: string;

  public static associations: {
    subject: BelongsTo<SubjectEvent, Subject>;
    event: BelongsTo<SubjectEvent, Event>;
  };
}

SubjectEvent.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  subject_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: 'id',
    },
    primaryKey: true,
  },
  event_id: {
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


SubjectEvent.belongsTo(Event, {
  foreignKey: 'event_id',
  as: 'event',
});

export default SubjectEvent;
