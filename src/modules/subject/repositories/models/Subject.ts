import { Model, DataTypes, HasMany, BelongsToMany } from 'sequelize';
import sequelize from '../../../../config/database';
import HourConfig from './HourConfig';
import Event from './Event';
import Need from './Need';
import SubjectEvent from './SubjectEvent';

// TODO: UNCOMMENT THE REFERENCE FOR THE ASSOCIATED TEACHER AND COORDINATOR
class Subject extends Model {
  public id!: number;
  public name!: string;
  public subject_code!: string;
  public study_plan_year!: number;
  public associated_teacher!: number;
  public associated_coordinator!: number;
  public index!: number;
  public frontal_hours!: number;
  public intro_folder!: string | null;
  public subject_folder!: string | null;
  public technologies!: string | null;
  public notes!: string | null;
  public valid!: boolean;
  public hourConfigs!: HourConfig[];
  public needs!: Need[];
  public events!: SubjectEvent[];

  public static associations: {
    hourConfigs: HasMany<Subject, HourConfig>;
    needs: HasMany<Subject, Need>;
    events: HasMany<Subject, SubjectEvent>;
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
    // references: {
    //   model: 'Teachers',
    //   key: 'id',
    // },
  },
  associated_coordinator: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // references: {
    //   model: 'Teachers',
    //   key: 'id',
    // },
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

HourConfig.belongsTo(Subject, {
  foreignKey: 'subject_id',
  as: 'subject',
});

Subject.hasMany(Need, {
  sourceKey: 'id',
  foreignKey: 'subject_id',
  as: 'needs',
});

Need.belongsTo(Subject, {
  foreignKey: 'subject_id',
  as: 'subject',
});

Subject.hasMany(SubjectEvent, {
  sourceKey: 'id',
  foreignKey: 'subject_id',
  as: 'events',
});


SubjectEvent.belongsTo(Subject, {
  foreignKey: 'subject_id',
  as: 'subject',
});

export default Subject;