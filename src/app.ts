import sequelize from "./config/database";
import subjectRouter  from "./routers/subjectRouter";
import eventRouter from "./routers/eventRouter";
import teacherRouter  from "./routers/teacherRouter";
import studyPlanRouter from "./routers/studyPlanRouter";
import needRouter from "./routers/needRouter";
import dotenv from 'dotenv';
import { initializeDatabase } from "./initializingData";
const logger = require('morgan');
const cors = require('cors');

dotenv.config();

const express = require('express');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
}));
app.use(express.json());
app.use(logger('dev'));

app.use("/api/subjects", subjectRouter);
app.use("/api/events", eventRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/study-plans", studyPlanRouter);
app.use("/api/needs", needRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false }); // create the tables if they do not exist
    console.log("Database connected!");
    await initializeDatabase();
  } catch (error) {
    console.log("Failed to connect to the database: ", error);
  }
});
