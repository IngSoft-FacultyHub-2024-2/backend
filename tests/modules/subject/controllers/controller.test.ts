import { Request, Response } from 'express';
import subjectService from '../../../../src/modules/subject/services/subjectService';
import inputSubjectSchema from '../../../../src/modules/subject/controllers/schemas/inputSubjectSchema';
import subjectController from '../../../../src/modules/subject/controllers/subjectController';
import { returnError } from '../../../../src/shared/utils/exceptions/handleExceptions';
import Subject from '../../../../src/modules/subject/repositories/models/Subject';

jest.mock('../../../../src/modules/subject/services/subjectService');
jest.mock('../../../../src/modules/subject/controllers/schemas/inputSubjectSchema');
jest.mock('../../../../src/shared/utils/exceptions/handleExceptions');

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
    (inputSubjectSchema.validate as jest.Mock).mockResolvedValue(mockReq.body);
    (subjectService.addSubject as jest.Mock).mockImplementation(async (subject: Partial<Subject>) => {
      return { id: 1, ...subjectBody };
    });

    await subjectController.addSubject(mockReq, mockRes);

    expect(inputSubjectSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(subjectService.addSubject).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ id: 1, ...subjectBody });
  });

  it('should handle errors when adding a subject fails', async () => {
    const error = new Error('Validation failed');
    (inputSubjectSchema.validate as jest.Mock).mockRejectedValue(error);

    await subjectController.addSubject(mockReq, mockRes);

    expect(returnError).toHaveBeenCalledWith(mockRes, error);
  });
});