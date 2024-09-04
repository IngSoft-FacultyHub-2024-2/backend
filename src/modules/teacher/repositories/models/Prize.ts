import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../../../../config/database';
import Teacher from './Teacher';

class Prize extends Model {
  public id!: number;
  public teacher_id!: number;
  public name!: string;
  public year!: Date;

  public static associations: {
    teacher: BelongsTo<Prize, Teacher>;
  };
}

Prize.init({
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Prize',
  tableName: 'Prizes',
  timestamps: true,
});

export default Prize;
