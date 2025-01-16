import { DataTypes, HasMany, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import Lecture from './Lecture';

class Semester extends Model {
  public id!: number;
  public name!: string;
  public start_date!: Date;
  public end_date!: Date;
  public study_plan_id!: number;
  public lectures!: Lecture[];

  public static associations: {
    lectures: HasMany<Semester, Lecture>;
  };
}

Semester.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'Semesters_name',
        msg: 'Ya existe un semestre con ese nombre',
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: {
        name: 'Semesters_start_date',
        msg: 'Ya existe un semestre con esa fecha de inicio',
      },
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      unique: {
        name: 'Semesters_end_date',
        msg: 'Ya existe un semestre con esa fecha de fin',
      },
    },
    study_plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Semester',
    tableName: 'Semesters',
    timestamps: true,
  }
);

Semester.hasMany(Lecture, {
  sourceKey: 'id',
  foreignKey: 'semester_id',
  as: 'lectures',
});
Lecture.belongsTo(Semester, {
  foreignKey: 'semester_id',
  as: 'semester',
});

export default Semester;
