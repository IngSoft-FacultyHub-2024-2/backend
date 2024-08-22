require("dotenv").config();

module.exports = {
  development: {
    database: process.env.NAME_DB,
    username: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    host: process.env.HOST_DB,
    dialect: "postgres",
    logging: false,
  },
};

// module.exports = {
//   development: {
//     username: process.env.USER_DB || 'postgres',
//     password: process.env.PASSWORD_DB || 'postegres',
//     database: process.env.NAME_DB || 'faculty_hub_db',
//     host: process.env.DATABASE_HOST || 'localhost',
//     dialect: 'postgres',
//   },
//   test: {
//     username: 'postgres',
//     password: null,
//     database: 'faculty_hub_db',
//     host: '127.0.0.1',
//     dialect: 'postgres',
//   },
//   production: {
//     username: process.env.USER_DB || 'postgres',
//     password: process.env.PASSWORD_DB || 'postegres',
//     database: process.env.NAME_DB || 'faculty_hub_db',
//     host: process.env.DATABASE_HOST || 'localhost',
//     dialect: 'postgres',
//   },
// };
