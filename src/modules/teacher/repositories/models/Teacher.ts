import { Model, DataTypes, HasMany, BelongsToMany } from 'sequelize';
import sequelize from '../../../../config/database';
import Prize from './Prize';
import CaesCourse from './CaesCourse';
import Contact from './Contact';
import TeacherCategory from './TeacherCategory';
import TeacherBenefit from './TeacherBenefit';
import TeacherSubject from './TeacherSubject';
import Benefit from './Benefit';
import Category from './Category';
import TeacherSubjectOfInterest from './TeacherSubjectOfInterest';

class Teacher extends Model {
  public id!: number;
  public name!: string;
  public surname!: string;
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
  public subjects!: TeacherSubject[];
  public subjects_of_interest!: TeacherSubjectOfInterest[];

  public static associations: {
    prizes: HasMany<Teacher, Prize>;
    caes_courses: HasMany<Teacher, CaesCourse>;
    contacts: HasMany<Teacher, Contact>;
    categories: BelongsToMany<Teacher, Category>;
    benefits: BelongsToMany<Teacher, Benefit>;
    subjects: HasMany<Teacher, TeacherSubject>;
    subjects_of_interest: HasMany<Teacher, TeacherSubjectOfInterest>;
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
    allowNull: false,
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
Prize.belongsTo(Teacher, {
  foreignKey: 'teacher_id',
  as: 'teacher',
});

Teacher.hasMany(CaesCourse, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'caes_courses',
});
CaesCourse.belongsTo(Teacher, {
  foreignKey: 'teacher_id',
  as: 'teacher',
});

Teacher.hasMany(Contact, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'contacts',
});
Contact.belongsTo(Teacher, {
  foreignKey: 'teacher_id',
  as: 'teacher',
});

Teacher.belongsToMany(Category, {
  through: TeacherCategory,
  as: 'categories',
  foreignKey: 'teacher_id',
  otherKey: 'category_id'
})
Category.belongsToMany(Teacher, {
  through: TeacherCategory,
  as: 'teachers',
  foreignKey: 'category_id',
  otherKey: 'teacher_id'
})
Teacher.hasMany(TeacherCategory, {as: 'teacher_categories'});
TeacherCategory.belongsTo(Teacher);
Category.hasMany(TeacherCategory);
TeacherCategory.belongsTo(Category);

Teacher.belongsToMany(Benefit, {
  through: TeacherBenefit,
  as: 'benefits',
  foreignKey: 'teacher_id',
  otherKey: 'benefit_id'
})
Benefit.belongsToMany(Teacher, {
  through: TeacherBenefit,
  as: 'teachers',
  foreignKey: 'benefit_id',
  otherKey: 'teacher_id'
})
Teacher.hasMany(TeacherBenefit, {as: 'teacher_benefits'});
TeacherBenefit.belongsTo(Teacher);
Benefit.hasMany(TeacherBenefit);
TeacherBenefit.belongsTo(Benefit);

// Teacher.hasMany(TeacherPair, {
//   sourceKey: 'id',
//   foreignKey: 'teacher_id',
//   as: 'teacher_pairs',
// });

// Teacher.belongsToMany(Teacher, { through: TeacherPair, as: 'teacher_pairs', })

Teacher.hasMany(TeacherSubject, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'subjects',
});
TeacherSubject.belongsTo(Teacher, {
  foreignKey: 'teacher_id',
  as: 'teacher',
});

Teacher.hasMany(TeacherSubjectOfInterest, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'subjects_of_interest',
});
TeacherSubjectOfInterest.belongsTo(Teacher, {
  foreignKey: 'teacher_id',
  as: 'teacher',
});


export default Teacher;
