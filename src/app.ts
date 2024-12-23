import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import sequelize from './config/database';
import degreeRouter from './routers/degreeRouter';
import eventRouter from './routers/eventRouter';
import fileProcessorRouter from './routers/fileProcessorRouter';
import moduleRouter from './routers/moduleRouter';
import needRouter from './routers/needRouter';
import semesterRouter from './routers/semesterRouter';
import studyPlanRouter from './routers/studyPlanRouter';
import subjectRouter from './routers/subjectRouter';
import teacherRouter from './routers/teacherRouter';
import assignTeachersToLecturesRouter from './routers/assignTeachersToLecturesRouter';

const logger = require('morgan');
const cors = require('cors');

dotenv.config();

const express = require('express');

const app = express();
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(logger('dev'));

// Add swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/subjects', subjectRouter);
app.use('/api/events', eventRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/study-plans', studyPlanRouter);
app.use('/api/needs', needRouter);
app.use('/api/modules', moduleRouter);
app.use('/api/file-processor', fileProcessorRouter);
app.use('/api/semesters', semesterRouter);
app.use('/api/degrees', degreeRouter);
app.use('/api/assignTeachersToLectures', assignTeachersToLecturesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false }); // create the tables if they do not exist
    console.log('Database connected!');
  } catch (error) {
    console.log('Failed to connect to the database: ', error);
  }
});
