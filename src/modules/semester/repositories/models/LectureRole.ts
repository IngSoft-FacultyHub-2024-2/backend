import { BelongsTo, DataTypes, HasMany, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import { SubjectRoles } from '../../../../shared/utils/enums/subjectRoles';
import Lecture from './Lecture';
import LectureHourConfig from './LectureHourConfig';
import LectureTeacher from './LectureTeacher';

class LectureRole extends Model {
  public id!: number;
  public lecture_id!: number;
  public role!: SubjectRoles;
  public hour_configs!: LectureHourConfig[];
  public teachers!: LectureTeacher[];
  public is_lecture_locked!: boolean; 

  public static associations: {
    lecture: BelongsTo<LectureRole, Lecture>;
    hour_configs: HasMany<LectureRole, LectureHourConfig>;
    teachers: HasMany<LectureRole, LectureTeacher>;
  };
}

LectureRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    lecture_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Lectures',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    role: {
      type: DataTypes.ENUM(SubjectRoles.TECHNOLOGY, SubjectRoles.THEORY),
      allowNull: false,
    },
    is_lecture_locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'LectureRole',
    tableName: 'LectureRoles',
    timestamps: true,
  }
);

LectureRole.hasMany(LectureHourConfig, {
  sourceKey: 'id',
  foreignKey: 'lecture_role_id',
  as: 'hour_configs',
});
LectureHourConfig.belongsTo(LectureRole, {
  foreignKey: 'lecture_role_id',
  as: 'lecture_role',
});

LectureRole.hasMany(LectureTeacher, {
  sourceKey: 'id',
  foreignKey: 'lecture_role_id',
  as: 'teachers',
});
LectureTeacher.belongsTo(LectureRole, {
  foreignKey: 'lecture_role_id',
  as: 'lecture_role',
});

export default LectureRole;
