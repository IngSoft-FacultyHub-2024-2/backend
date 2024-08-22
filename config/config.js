require('dotenv').config();

module.exports = {
  development: {
    database: process.env.USER_DB,
    username: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    host: process.env.HOST_DB,
    dialect: 'postgres',
  },
};

// module.exports = {
//   development: {
//     username: 'postgres',
//     password: 'postgres',
//     database: 'faculty_hub_db',
//     host: 'localhost',
//     dialect: 'postgres',
//   },
//   test: {
//     username: 'postgres',
//     password: 'postgres',
//     database: 'faculty_hub_db',
//     host: 'localhost',
//     dialect: 'postgres',
//   },
//   production: {
//     username: 'postgres',
//     password: 'postgres',
//     database: 'faculty_hub_db',
//     host: 'localhost',
//     dialect: 'postgres',
//   },
// };
