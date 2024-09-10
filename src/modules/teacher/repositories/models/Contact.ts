import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../../../../config/database';
import Teacher from './Teacher';

class Contact extends Model {
    public id!: number;
    public teacher_id!: number;
    public mean!: string;
    public data!: string;
    public prefered!: boolean;

		public static associations: {
			teacher: BelongsTo<Contact, Teacher>;
		};
}

Contact.init({
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
			key: 'id',
    },
	},
  mean: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'data',
      msg: 'Contact data already exists',
    }
  },
  prefered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'Contact',
  tableName: 'Contacts',
  timestamps: true,
});

export default Contact;
