import { Request, Response } from 'express';
import {addSubject, getSubjects} from '../../src/modules/subject';
import { getTeacherById } from '../../src/modules/teacher';
import subjectController from '../../src/controllers/subjectController';

jest.mock('../../src/modules/subject');
jest.mock('../../src/modules/teacher');

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
    }],
    "events": []
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
});


describe('getSubjects', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {
      query: {}
    };
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    res = {
      status: statusMock,
      json: jsonMock
    };
  });

  it('should return subjects with coordinators', async () => {
    const mockSubjects = [
      { id: 1, associated_coordinator: 101 },
      { id: 2, associated_coordinator: 102 }
    ];
    const mockCoordinator1 = { id: 101, name: 'John', surname: 'Doe' };
    const mockCoordinator2 = { id: 102, name: 'Jane', surname: 'Smith' };
    const mockSubjectDto1 = { id: 1, associated_coordinator_name: 'John Doe', name: undefined, subject_code: undefined, study_plan_year: undefined, index: undefined, hourConfigs: [] };
    const mockSubjectDto2 = { id: 2, associated_coordinator_name: 'Jane Smith', name: undefined, subject_code: undefined, study_plan_year: undefined, index: undefined, hourConfigs: [] };

    (getSubjects as jest.Mock).mockResolvedValue(mockSubjects);
    (getTeacherById as jest.Mock)
      .mockResolvedValueOnce(mockCoordinator1)
      .mockResolvedValueOnce(mockCoordinator2);

    await subjectController.getSubjects(req as Request, res as Response);

    expect(getSubjects).toHaveBeenCalledWith({}, undefined, undefined, undefined, undefined);
    expect(getTeacherById).toHaveBeenCalledWith(101);
    expect(getTeacherById).toHaveBeenCalledWith(102);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith([mockSubjectDto1, mockSubjectDto2]);
  });

});