import { BelongsTo, DataTypes, HasMany, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import LectureGroup from './LectureGroup';
import LectureRole from './LectureRole';
import Semester from './Semester';

class Lecture extends Model {
    public id!: number;
    public semester_id!: number;
    public subject_id!: number;
    public lecture_groups!: LectureGroup[];
    public lecture_roles!: LectureRole[];

    public static associations: {
        semester: BelongsTo<Lecture, Semester>;
        lecture_groups: HasMany<Lecture, LectureGroup>;
        lecture_roles: HasMany<Lecture, LectureRole>;
    };
}

Lecture.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        semester_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Semesters',
                key: 'id',
            },
        },
        subject_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,
        modelName: 'Lecture',
        tableName: 'Lectures',
        timestamps: true,
      }
);

Lecture.hasMany(LectureGroup, {
    sourceKey: 'id',
    foreignKey: 'lecture_id',
    as: 'lecture_groups'
});
LectureGroup.belongsTo(Lecture, {
    foreignKey: 'lecture_id',
    as: 'lecture'
});

Lecture.hasMany(LectureRole, {
    sourceKey: 'id',
    foreignKey: 'lecture_id',
    as: 'lecture_roles'
});
LectureRole.belongsTo(Lecture, {
    foreignKey: 'lecture_id',
    as: 'lecture'
});

export default Lecture;
