import {
  BelongsTo,
  BelongsToMany,
  DataTypes,
  HasMany,
  HasManySetAssociationsMixin,
  Model,
} from 'sequelize';
import sequelize from '../../../../config/database';
import HourConfig from './HourConfig';
import Need from './Need';
import StudyPlan from './StudyPlan';
import SubjectEvent from './SubjectEvent';

// TODO: UNCOMMENT THE REFERENCE FOR THE ASSOCIATED TEACHER AND COORDINATOR
class Subject extends Model {
  public id!: number;
  public name!: string;
  public subject_code!: string;
  public acronym!: string;
  public study_plan_year!: number;
  public study_plan_id!: number;
  public associated_coordinator!: number;
  public index!: number;
  public frontal_hours!: number;
  public total_hours!: number;
  public intro_folder!: string | null;
  public subject_folder!: string | null;
  public technologies!: string | null;
  public notes!: string | null;
  public is_teo_tec_at_same_time!: boolean;
  public valid!: boolean;
  public hour_configs!: HourConfig[];
  public needs_notes!: string;
  public events!: SubjectEvent[];

  public needs_ids!: number[];
  public needs!: Need[];
  public study_plan!: StudyPlan;

  public static associations: {
    hour_configs: HasMany<Subject, HourConfig>;
    needs: BelongsToMany<Subject, Need>;
    events: HasMany<Subject, SubjectEvent>;
    study_plan: BelongsTo<Subject, StudyPlan>;
  };

  public setNeeds!: HasManySetAssociationsMixin<Need, number>;
}

Subject.init(
  {
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
    acronym: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    study_plan_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    associated_coordinator: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    study_plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'StudyPlans',
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
    total_hours: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
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
    needs_notes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_teo_tec_at_same_time: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    valid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Subject',
    tableName: 'Subjects',
    timestamps: true,
    paranoid: true,
    validate: {
      totalHoursEqualHourConfigs(this: Subject) {
        const totalHours =
          this.getDataValue('index') * this.getDataValue('frontal_hours');
        const hourConfigsTotal = this.hour_configs
          ? this.hour_configs.reduce(
              (sum, config) => sum + Number(config.total_hours),
              0
            )
          : 0;
        if (totalHours !== hourConfigsTotal) {
          throw new Error(
            'La suma de las horas totales docentes debe ser igual a la cantidad de horas totales configuradas que se van a dictar'
          );
        }
      },
    },
    hooks: {
      beforeSave: (subject) => {
        // Calculate and set total_hours before saving on the db
        subject.total_hours = subject.index * subject.frontal_hours;
      },
    },
  }
);

Subject.hasMany(HourConfig, {
  sourceKey: 'id',
  foreignKey: 'subject_id',
  as: 'hour_configs',
});

HourConfig.belongsTo(Subject, {
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

Subject.belongsToMany(Need, {
  through: 'SubjectNeed', // This is the join table
  foreignKey: 'subject_id',
  otherKey: 'need_id',
  as: 'needs',
});

Need.belongsToMany(Subject, {
  through: 'SubjectNeed', // This is the join table
  foreignKey: 'need_id',
  otherKey: 'subject_id',
  as: 'subjects',
});

export default Subject;
