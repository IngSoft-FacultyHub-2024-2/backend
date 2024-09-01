import { Model, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../../../../config/database';
import Teacher from './Teacher';

class CaesCourse extends Model {
    public id!: number;
    public teacher_id!: number;
    public name!: string;
    public date!: Date;

    public static associations: {
        teacher: BelongsTo<CaesCourse, Teacher>;
    };
}

CaesCourse.init({
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
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'CaesCourse',
  tableName: 'CaesCourses',
  timestamps: true,
});

export default CaesCourse;
