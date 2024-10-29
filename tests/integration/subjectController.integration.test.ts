// __tests__/subjectController.integration.test.ts

import request from 'supertest';
import app from '../../src/app'; 
import sequelize from '../../src/config/database';
import Subject from '../../src/modules/subject/repositories/models/Subject';
import HourConfig from '../../src/modules/subject/repositories/models/HourConfig'; // Import your HourConfig model
import Event from '../../src/modules/subject/repositories/models/Event'; // Import your Event model
import Need from '../../src/modules/subject/repositories/models/Need';
import SubjectEvent from '../../src/modules/subject/repositories/models/SubjectEvent';
import StudyPlan from '../../src/modules/subject/repositories/models/StudyPlan';

describe('SubjectController Integration Tests', () => {
  // Run database migrations or setup before tests
  beforeAll(async () => {
    console.log('Starting test...');
    await sequelize.sync({ force: true });
    console.log('Sync');

    await Need.create({ name: 'Necesidad 1', id: 1 });
    await Event.create({ name: 'Evento 1', id: 1 });
    await StudyPlan.create({ name: 'Plan 1', year: 2021, id: 1 });
    console.log('GOOD');

});
  

  // Clean up data after each test to maintain isolation
  afterEach(async () => {
    await Subject.destroy({ where: {} });
    await HourConfig.destroy({ where: {} }); // Clean up HourConfig
    await SubjectEvent.destroy({ where: {} }); // Clean up Events
  });

  // Close database connection after all tests
  afterAll(async () => {
    await Need.destroy({ where: {} });
    await Event.destroy({ where: {} });
    await StudyPlan.destroy({ where: {} });
    await sequelize.close();
  });

  it('Post: should add a new subject', async () => {
    const newSubject = {
        name: 'Diseño 1',
        subject_code: 'code',
        acronym: 'DA1',
        study_plan_id: 1,
        associated_coordinator: 5,
        index: 1,
        frontal_hours: 120,
        intro_folder: '/src/',
        subject_folder: '/src/r',
        technologies: 'ruby',
        notes: 'nueva materia',
        hour_configs: [
          { role: 'Teórico', total_hours: 100 },
          { role: 'Tecnología', total_hours: 20 }
        ],
        needs_ids: [1],
        needs_notes: '',
        events: [
          {
            event_id: 1,
            description: 'El 1er obligatorio, es de a 2 maximo y da 40 puntos maximo y tiene un minimo de 10 puntos'
          }
        ]
      };
    const response = await request(app)
      .post('/subjects')
      .send(newSubject)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newSubject.name);

   // Check directly in the database to verify data was saved
   const savedSubject = await Subject.findByPk(response.body.id);
   expect(savedSubject).not.toBeNull();
   expect(savedSubject?.name).toBe(newSubject.name);
   if (!savedSubject) throw new Error('Subject not found');

   // Check for hour_configs
   expect(savedSubject.hour_configs.length).toBe(newSubject.hour_configs.length);

   // Check for events
   expect(savedSubject.events.length).toBe(newSubject.events.length);
  });

  it('Get: should fetch all subjects', async () => {
    await Subject.create({
        name: 'Science',
        subject_code: 'SCI101',
        acronym: 'SCI',
        study_plan_id: 1,
        associated_coordinator: 2,
        index: 1,
        frontal_hours: 120,
        intro_folder: '/src/',
        subject_folder: '/src/sci',
        technologies: 'science',
        notes: 'science course'
      });

    const response = await request(app)
      .get('/subjects')
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Science');
  });

  it('Get /:id should get a subject by ID', async () => {
    const subject = await Subject.create({
        name: 'History',
        subject_code: 'HIST101',
        acronym: 'HIS',
        study_plan_id: 1,
        associated_coordinator: 3,
        index: 2,
        frontal_hours: 60,
        intro_folder: '/src/',
        subject_folder: '/src/hist',
        technologies: 'history',
        notes: 'History course'
      });

    const response = await request(app)
      .get(`/subjects/${subject.id}`)
      .expect(200);

    expect(response.body.name).toBe(subject.name);
  });

  it('Put /:id should update a subject', async () => {
    const subject = await Subject.create({
      name: 'Geography',
      subject_code: 'GEO101',
      acronym: 'GEO',
      study_plan_id: 1,
      associated_coordinator: 4,
      index: 1,
      frontal_hours: 80,
      intro_folder: '/src/',
      subject_folder: '/src/geo',
      technologies: 'geography',
      notes: 'Geography course'
    });

    const updatedData = { name: 'Advanced Geography', credits: 4 };

    const response = await request(app)
      .put(`/subjects/${subject.id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.credits).toBe(updatedData.credits);
  });

  it('Delete /:id should delete a subject', async () => {
    const subject = await Subject.create({
        name: 'Chemistry',
        subject_code: 'CHEM101',
        acronym: 'CHE',
        study_plan_id: 1,
        associated_coordinator: 5,
        index: 1,
        frontal_hours: 120,
        intro_folder: '/src/',
        subject_folder: '/src/chem',
        technologies: 'chemistry',
        notes: 'Chemistry course'
      });
  
    await request(app)
      .delete(`/subjects/${subject.id}`)
      .expect(204);

    const deletedSubject = await Subject.findByPk(subject.id);
    expect(deletedSubject).toBeNull();
  });
});
