import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.USER_DB);

const sequelize = new Sequelize(
  process.env.NAME_DB!,
  process.env.USER_DB!,
  process.env.PASSWORD_DB,
  {
    host: process.env.HOST_DB,
    dialect: "postgres",
    port: parseInt(process.env.PORT_DB!),
  }
);

export default sequelize;