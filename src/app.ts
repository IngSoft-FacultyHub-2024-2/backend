import sequelize from "./config/database";
import subjectRouter  from "./routers/subjectRouter";
import eventRouter from "./routers/eventRouter";
import teacherRouter  from "./routers/teacherRouter";
import dotenv from 'dotenv';
import { initializeDatabase } from "./initializingData";

dotenv.config();

const express = require('express');

const app = express();
app.use(express.json());

app.use("/api/subjects", subjectRouter);
app.use("/api/events", eventRouter);
app.use("/api/teachers", teacherRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    sequelize.sync({ force: false }); // create the tables if they do not exist
    console.log("Database connected!");
    //await initializeDatabase();
  } catch (error) {
    console.log("Failed to connect to the database: ", error);
  }
});
