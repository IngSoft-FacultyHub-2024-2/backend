import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../../config/database';

class Degree extends Model {
    public id!: number;
    public name!: string;
    public acronym!: string;
}

Degree.init({
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
                name: 'Degrees_name',
                msg: 'El nombre de la carrera ya existe',
            }
        },
        acronym: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'Degrees_acronym',
                msg: 'El acrónimo de la carrera ya existe',
            }
        },
    },
    {
        sequelize,
        modelName: 'Degree',
        tableName: 'Degrees',
        timestamps: true,
      }
);

export default Degree;
