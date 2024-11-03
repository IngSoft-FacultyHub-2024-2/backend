import { BelongsTo, DataTypes, Model } from "sequelize";
import sequelize from '../../../../config/database';
import { WeekDays } from "../../../../shared/utils/enums/WeekDays";
import LectureRole from "./LectureRole";

class LectureHourConfig extends Model {
  public id!: string;
  public lecture_role_id!: number;
  public day_of_week!: WeekDays;
  public modules!: number[];

  public static associations: {
    lecture_role: BelongsTo<LectureHourConfig, LectureRole>;
  };
}

LectureHourConfig.init({
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
  day_of_week: {
    type: DataTypes.ENUM(WeekDays.MONDAY, WeekDays.TUESDAY, WeekDays.WEDNESDAY, WeekDays.THURSDAY, WeekDays.FRIDAY),
    allowNull: false,
  },
  modules: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'LectureHourConfig',
  tableName: 'LectureHourConfigs',
  timestamps: true,
});

export default LectureHourConfig;

