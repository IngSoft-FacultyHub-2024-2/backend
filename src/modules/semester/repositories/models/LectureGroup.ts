import { BelongsTo, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../config/database';
import Lecture from './Lecture';

class LectureGroup extends Model {
    public id!: number;
    public lecture_id!: number;
    public degree_id!: number;
    public group!: string;

    public static associations: {
        lecture: BelongsTo<LectureGroup, Lecture>;
    };
}

LectureGroup.init({
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
    degree_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    group: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
    {
        sequelize,
        modelName: 'LectureGroup',
        tableName: 'LectureGroups',
        timestamps: true,
      });

export default LectureGroup;
