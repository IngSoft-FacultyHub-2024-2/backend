import { Model, DataTypes, HasMany, BelongsToMany } from 'sequelize';
import sequelize from '../../../../config/database';
import Prize from './Prize';
import CaesCourse from './CaesCourse';
import Contact from './Contact';
import TeacherCategory from './TeacherCategory';
import TeacherBenefit from './TeacherBenefit';
import TeacherSubjectHistory from './TeacherSubjectHistory';
import Benefit from './Benefit';
import Category from './Category';
import TeacherSubjectOfInterest from './TeacherSubjectOfInterest';
import TeacherSubjectGroupMember from './TeacherSubjectGroupMember';
import TeacherSubjectGroup from './TeacherSubjectGroup';
import TeacherAvailableModule from './TeacherAvailableModules';
import { TeacherStates } from '../../../../shared/utils/teacherStates';

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
  public linkedin_link!: string | null;
  public graduated!: boolean;
  public notes!: string | null;
  public state!: TeacherStates;
  public retentionDate!: Date | null;
  public unsubscribe_risk!: number;
  public prizes!: Prize[];
  public caes_courses!: CaesCourse[];
  public contacts!: Contact[];
  public categories!: TeacherCategory[];
  public benefits!: TeacherBenefit[];
  public subjects_history!: TeacherSubjectHistory[];
  public subjects_of_interest!: TeacherSubjectOfInterest[];
  public teacher_subject_groups!: TeacherSubjectGroup[];
  public teacher_available_modules!: TeacherAvailableModule[];

  public static associations: {
    prizes: HasMany<Teacher, Prize>;
    caes_courses: HasMany<Teacher, CaesCourse>;
    contacts: HasMany<Teacher, Contact>;
    categories: HasMany<Teacher, TeacherCategory>;
    benefits: HasMany<Teacher, TeacherBenefit>;
    subjects_history: HasMany<Teacher, TeacherSubjectHistory>;
    subjects_of_interest: HasMany<Teacher, TeacherSubjectOfInterest>;
    teacher_subject_groups: HasMany<Teacher, TeacherSubjectGroup>;
    teacher_available_modules: HasMany<Teacher, TeacherAvailableModule>;
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
    unique: {
      name: 'employee_number',
      msg: 'Employee number already exists',
    }

  },
  cv_file: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  how_they_found_us: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_photo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hiring_date: {
    type: DataTypes.DATE,
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
    type: DataTypes.ENUM(TeacherStates.ACTIVE, TeacherStates.TEMPORARY_LEAVE, TeacherStates.INACTIVE),
    allowNull: false,
    defaultValue: 'activo',
  },
  retentionDate: {
    type: DataTypes.DATE,
    allowNull: true,
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
  paranoid: true,
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

// Teacher.belongsToMany(Category, {
//   through: TeacherCategory,
//   as: 'categorias',
//   foreignKey: 'teacher_id',
//   otherKey: 'category_id'
// })
// Category.belongsToMany(Teacher, {
//   through: TeacherCategory,
//   as: 'teachers',
//   foreignKey: 'category_id',
//   otherKey: 'teacher_id'
// })
Teacher.hasMany(TeacherCategory, {sourceKey: 'id', as: 'categories', foreignKey: 'teacher_id'});
TeacherCategory.belongsTo(Teacher, {foreignKey: 'teacher_id', as: 'teacher'});
// Category.hasMany(TeacherCategory, {as: 'categories', foreignKey: 'category_id'});
// TeacherCategory.belongsTo(Category, {foreignKey: 'category_id', as: 'category'});

// Teacher.belongsToMany(Benefit, {
//   through: TeacherBenefit,
//   as: 'benefits',
//   foreignKey: 'teacher_id',
//   otherKey: 'benefit_id'
// })
// Benefit.belongsToMany(Teacher, {
//   through: TeacherBenefit,
//   as: 'teachers',
//   foreignKey: 'benefit_id',
//   otherKey: 'teacher_id'
// })
Teacher.hasMany(TeacherBenefit, {as: 'benefits', foreignKey: 'teacher_id'});
TeacherBenefit.belongsTo(Teacher, {foreignKey: 'teacher_id', as: 'teacher'});
// Benefit.hasMany(TeacherBenefit, {as: 'benefits', foreignKey: 'benefit_id'});
// TeacherBenefit.belongsTo(Benefit, {foreignKey: 'benefit_id', as: 'benefit'});

Teacher.hasMany(TeacherSubjectHistory, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'subjects_history',
});
TeacherSubjectHistory.belongsTo(Teacher, {
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

Teacher.belongsToMany(TeacherSubjectGroup, {
  through: TeacherSubjectGroupMember,
  as: 'teacher_subject_groups',
  foreignKey: 'teacher_id',
  otherKey: 'teacher_subject_group_id'
});
TeacherSubjectGroup.belongsToMany(Teacher, {
  through: TeacherSubjectGroupMember,
  as: 'teachers',
  foreignKey: 'teacher_subject_group_id',
  otherKey: 'teacher_id'
});
// Teacher.hasMany(TeacherSubjectGroupMember, {as: 'teacher_subject_group_members'});
// TeacherSubjectGroupMember.belongsTo(Teacher);
// TeacherSubjectGroup.hasMany(TeacherSubjectGroupMember);
// TeacherSubjectGroupMember.belongsTo(TeacherSubjectGroup);

Teacher.hasMany(TeacherAvailableModule, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'teacher_available_modules',
});
TeacherAvailableModule.belongsTo(Teacher, {
  foreignKey: 'teacher_id',
  as: 'teacher',
});


export default Teacher;
