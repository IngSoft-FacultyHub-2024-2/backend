import { Request, Response } from 'express';
import {addSubject} from '../../src/modules/subject';
import subjectController from '../../src/controllers/subjectController';

jest.mock('../../src/modules/subject');

describe('SubjectController', () => {
  let subjectBody: any = {"name": "andy2",
    "subject_code": "code",
    "study_plan_year": 2000,
    "associated_teacher": 15,
    "associated_coordinator": 16,
    "index": 1.2,
    "frontal_hours": 120,
    "intro_folder": "/src/",
    "subject_folder": "/src/r",
    "technologies": "ruby",
    "notes": "nueva materia",
    "hourConfigs": [{
        "role": "Teorico",
        "total_hours": 100,
        "weekly_hours": 10
    }],
    "needs":[{
        "name": "laboratorio"
    },{
        "name": "salon de 25 personas"
    }]
  };
  const mockReq = { body: subjectBody } as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a subject successfully', async () => {
    (addSubject as jest.Mock).mockImplementation(async (subject: Partial<any>) => {
      return { id: 1, ...subjectBody };
    });

    await subjectController.addSubject(mockReq, mockRes);

    expect(addSubject).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ id: 1, ...subjectBody });
  });

  it('should handle errors when adding a subject fails', async () => {
    mockReq.body = {};
    await subjectController.addSubject(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});