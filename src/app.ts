import dotenv from 'dotenv';
import sequelize from './config/database';
import { initializeDatabase } from './initializingData';
import degreeRouter from './routers/degreeRouter';
import eventRouter from './routers/eventRouter';
import fileProcessorRouter from './routers/fileProcessorRouter';
import moduleRouter from './routers/moduleRouter';
import needRouter from './routers/needRouter';
import semesterRouter from './routers/semesterRouter';
import studyPlanRouter from './routers/studyPlanRouter';
import subjectRouter from './routers/subjectRouter';
import teacherRouter from './routers/teacherRouter';
const logger = require('morgan');
const cors = require('cors');

dotenv.config();

const express = require('express');

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
app.use(express.json());
app.use(logger('dev'));

app.use('/api/subjects', subjectRouter);
app.use('/api/events', eventRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/study-plans', studyPlanRouter);
app.use('/api/needs', needRouter);
app.use('/api/modules', moduleRouter);
app.use('/api/file-processor', fileProcessorRouter);
app.use('/api/semesters', semesterRouter);
app.use('/api/degrees', degreeRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false }); // create the tables if they do not exist
    console.log('Database connected!');
    await initializeDatabase();
  } catch (error) {
    console.log('Failed to connect to the database: ', error);
  }
});
