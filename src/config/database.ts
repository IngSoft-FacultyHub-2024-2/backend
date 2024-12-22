import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.USER_DB);

const isSSLRequired = process.env.DB_SSL === 'true';

const sequelize = new Sequelize(
  process.env.NAME_DB!,
  process.env.USER_DB!,
  process.env.PASSWORD_DB,
  {
    host: process.env.HOST_DB,
    dialect: 'postgres',
    dialectOptions: isSSLRequired
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : undefined, // No `ssl` option when SSL is not required
    port: parseInt(process.env.PORT_DB!),
    logging: false,
  }
);

export default sequelize;
