import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../config/database';
import Subject from './Subject';

class Event extends Model {
  public id!: number;
  public title!: string;
  public description!: string;

  public static associations: {
    subject: BelongsTo<Event, Subject>;
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
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Need',
  tableName: 'Needs',
  timestamps: true,
});

Event.belongsTo(Subject, {
    foreignKey: 'subject_id',
    as: 'subject',
    });

export default Event;
