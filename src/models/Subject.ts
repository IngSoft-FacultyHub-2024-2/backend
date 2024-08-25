import { Model, DataTypes, HasMany } from 'sequelize';
import sequelize from '../config/database';
import HourConfig from './HourConfig';
import Need from './Need';

class Subject extends Model {
  public id!: number;
  public name!: string | null;
  public subject_code!: string | null;
  public study_plan_year!: number | null;
  public associated_teacher!: number | null;
  public associated_coordinator!: number | null;
  public index!: number | null;
  public frontal_hours!: number | null;
  public intro_folder!: string | null;
  public subject_folder!: string | null;
  public technologies!: string | null;
  public notes!: string | null;
  public valid!: boolean;
  public hour_configs!: HourConfig[];
  public needs!: Need[];

  public static associations: {
    hourConfigs: HasMany<Subject, HourConfig>;
    needs: HasMany<Subject, Need>;
  };
}

Subject.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  study_plan_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  associated_teacher: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Teachers',
      key: 'id',
    },
  },
  associated_coordinator: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Teachers',
      key: 'id',
    },
  },
  index: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  frontal_hours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  intro_folder: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subject_folder: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  technologies: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  valid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  sequelize,
  modelName: 'Subject',
  tableName: 'Subjects',
  timestamps: true,
});

Subject.hasMany(HourConfig, {
  sourceKey: 'id',
  foreignKey: 'subject_id',
  as: 'hourConfigs',
});

Subject.hasMany(Need, {
  sourceKey: 'id',
  foreignKey: 'subject_id',
  as: 'needs',
});

export default Subject;
