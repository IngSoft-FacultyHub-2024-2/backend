import sequelize from "./config/database";
import router from "./routes/routes";
import dotenv from 'dotenv';

dotenv.config();

const express = require('express');

const app = express();
app.use(express.json());

app.use("/api", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
  } catch (error) {
    console.log("Failed to connect to the database: ", error);
  }
});
