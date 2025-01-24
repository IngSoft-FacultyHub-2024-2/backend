import { BelongsTo, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import LectureRole from './LectureRole';

class LectureTeacher extends Model {
  public id!: number;
  public lecture_role_id!: number;
  public teacher_id!: number;
  public is_technology_teacher!: boolean;

  public static associations: {
    lecture_role: BelongsTo<LectureTeacher, LectureRole>;
  };
}

LectureTeacher.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    lecture_role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'LectureRoles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_technology_teacher: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'LectureTeacher',
    tableName: 'LectureTeachers',
    timestamps: true,
  }
);

export default LectureTeacher;
