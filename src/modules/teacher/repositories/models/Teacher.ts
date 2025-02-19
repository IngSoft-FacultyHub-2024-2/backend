import { DataTypes, HasMany, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import { TeacherStates } from '../../../../shared/utils/enums/teacherStates';
import CaesCourse from './CaesCourse';
import Contact from './Contact';
import Prize from './Prize';
import TeacherAvailableModule from './TeacherAvailableModules';
import TeacherBenefit from './TeacherBenefit';
import TeacherCategory from './TeacherCategory';
import TeacherSubjectGroup from './TeacherSubjectGroup';
import TeacherSubjectGroupMember from './TeacherSubjectGroupMember';
import TeacherSubjectHistory from './TeacherSubjectHistory';
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
  public deletedAt!: Date | null;
  public dismiss_motive !: string | null;

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

  public async getSeniorityInSemesters(): Promise<number> {
    const subjects_history = await TeacherSubjectHistory.findAll({
      where: { teacher_id: this.id },
    });
    const now = new Date();
    let totalMonths = 0;

    subjects_history.forEach((subject_history) => {
      const startDate = subject_history.start_date;
      const endDate = subject_history.end_date || now;

      // Calculate months of seniority for this history
      const months =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());
      totalMonths += Math.max(0, months); // Ensure no negative values
    });

    // Convert months to semesters (6 months = 1 semester) and round to nearest integer
    return Math.round(totalMonths / 6);
  }
}

Teacher.init(
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
        msg: 'El número de funcionario ya existe',
      },
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
      type: DataTypes.ENUM(
        TeacherStates.ACTIVE,
        TeacherStates.TEMPORARY_LEAVE,
        TeacherStates.INACTIVE
      ),
      allowNull: false,
      defaultValue: 'activo',
    },
    retentionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    unsubscribe_risk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dismiss_motive: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Teacher',
    tableName: 'Teachers',
    timestamps: true,
    paranoid: true,
  }
);

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

Teacher.hasMany(TeacherCategory, {
  sourceKey: 'id',
  as: 'categories',
  foreignKey: 'teacher_id',
});
TeacherCategory.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

Teacher.hasMany(TeacherBenefit, { as: 'benefits', foreignKey: 'teacher_id' });
TeacherBenefit.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

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
  otherKey: 'teacher_subject_group_id',
});
TeacherSubjectGroup.belongsToMany(Teacher, {
  through: TeacherSubjectGroupMember,
  as: 'teachers',
  foreignKey: 'teacher_subject_group_id',
  otherKey: 'teacher_id',
});

Teacher.hasMany(TeacherAvailableModule, {
  sourceKey: 'id',
  foreignKey: 'teacher_id',
  as: 'teacher_available_modules',
});
TeacherAvailableModule.belongsTo(Teacher, {
  foreignKey: 'teacher_id',
  as: 'teacher',
});
TeacherSubjectGroup.hasMany(TeacherSubjectGroupMember, {
  sourceKey: 'id',
  foreignKey: 'teacher_subject_group_id',
  as: 'members',
});
TeacherSubjectGroupMember.belongsTo(TeacherSubjectGroup, {
  foreignKey: 'teacher_subject_group_id',
  as: 'teacher_subject_group',
});

export default Teacher;
