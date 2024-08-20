import { Model, DataTypes, HasMany } from 'sequelize';
import sequelize from '../config/database';
import Prize from './Prize';
import CaesCourse from './CaesCourse';
import Contact from './Contact';
import TeacherCategory from './TeacherCategory';
import TeacherBenefit from './TeacherBenefit';
import TeacherPair from './TeacherPair';
import TeacherSubject from './TeacherSubject';

class Teacher extends Model {
  public id!: number;
  public name!: string | null;
  public surname!: string | null;
  public birth_date!: Date | null;
  public employee_number!: number | null;
  public cv_file!: string | null;
  public how_they_found_us!: string | null;
  public id_photo!: string | null;
  public hiring_date!: Date | null;
  public contact_hours!: string | null;
  public linkedin_link!: string | null;
  public graduated!: boolean;
  public notes!: string | null;
  public state!: 'activo' | 'baja temporal' | 'baja';
  public unsusbribe_risk!: number;
  public prizes!: Prize[];
  public caes_courses!: CaesCourse[];
  public contacts!: Contact[];
  public categories!: TeacherCategory[];
  public benefits!: TeacherBenefit[];
  public teacher_pairs!: TeacherPair[];
  public subjects!: TeacherSubject[];

  public static associations: {
    prizes: HasMany<Teacher, Prize>;
    caes_courses: HasMany<Teacher, CaesCourse>;
    contacts: HasMany<Teacher, Contact>;
    categories: HasMany<Teacher, TeacherCategory>;
    benefits: HasMany<Teacher, TeacherBenefit>;
    teacher_pairs: HasMany<Teacher, TeacherPair>;
    subjects: HasMany<Teacher, TeacherSubject>;
  };
}

Teacher.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birth_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  employee_number: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
  },
  cv_file: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  how_they_found_us: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hiring_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  contact_hours: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedin_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  graduated: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.ENUM('activo', 'baja temporal', 'baja'),
    allowNull: false,
    defaultValue: 'activo',
  },
  unsusbribe_risk: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'Teacher',
  tableName: 'Teachers',
  timestamps: true,
});

Teacher.hasMany(Prize, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'prizes',
});

Teacher.hasMany(CaesCourse, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'caes_courses',
});

Teacher.hasMany(Contact, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'contacts',
});

Teacher.hasMany(TeacherCategory, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'categories',
});

Teacher.hasMany(TeacherBenefit, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'benefits',
});

Teacher.hasMany(TeacherPair, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'teacher_pairs',
});

Teacher.hasMany(TeacherSubject, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'subjects',
});

export default Teacher;
