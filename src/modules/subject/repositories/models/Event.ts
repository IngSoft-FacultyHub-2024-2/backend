import { Model, DataTypes, HasMany } from 'sequelize';
import SubjectEvent from './SubjectEvent';
import sequelize from '../../../../config/database';

class Event extends Model {
  public id!: number;
  public title!: string;

  public static associations: {
    subjectEvents: HasMany<Event, SubjectEvent>;
  };
}

Event.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'Event',
  tableName: 'Events',
  timestamps: true,
});

export default Event;
