import { DataTypes, Model } from "sequelize";
import sequelize from '../../../../config/database';
import { ModuleTurn } from "../../../../shared/utils/moduleTurn";

class Module extends Model {
    public id!: number;
    public time!: String;
    public turn!: String;
}

Module.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '00:00',
    },
    turn: {
        type: DataTypes.ENUM(ModuleTurn.MATUTINE, ModuleTurn.NOCTURN),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Module',
    tableName: 'Modules',
    timestamps: true,
});

export default Module;