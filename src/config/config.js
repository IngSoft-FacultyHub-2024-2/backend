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
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postegres',
    database: process.env.DB_NAME || 'faculty_hub_db',
    host: process.env.DATABASE_HOST || 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: 'postgres',
    password: null,
    database: 'faculty_hub_db',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postegres',
    database: process.env.DB_NAME || 'faculty_hub_db',
    host: process.env.DATABASE_HOST || 'localhost',
    dialect: 'postgres',
  },
};
