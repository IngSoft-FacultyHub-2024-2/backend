// require("dotenv").config();

// module.exports = {
//   development: {
//     database: process.env.DB_NAME,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//     logging: false,
//   },
// };

module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'faculty_hub_db',
    host: 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'faculty_hub_db',
    host: 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: 'postgres',
    password: 'postgres',
    database: 'faculty_hub_db',
    host: 'localhost',
    dialect: 'postgres',
  },
};
