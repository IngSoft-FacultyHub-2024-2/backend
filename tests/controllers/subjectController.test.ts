import { Request, Response } from 'express';
import {addSubject, getSubjects, getSubjectById} from '../../src/modules/subject';
import { getTeacherById } from '../../src/modules/teacher';
import subjectController from '../../src/controllers/subjectController';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';

jest.mock('../../src/modules/subject');
jest.mock('../../src/modules/teacher');
jest.mock('../../src/shared/utils/exceptions/handleExceptions');

describe('SubjectController', () => {
  let subjectBody: any = {
    "name": "Diseño1",
    "subject_code": "code",
    "acronym": "DA1",
    "study_plan_year": 2000,
    "associated_teacher": 15,
    "associated_coordinator": 16,
    "index": 1,
    "frontal_hours": 120,
    "intro_folder": "/src/",
    "subject_folder": "/src/r",
    "technologies": "ruby",
    "notes": "nueva materia",
    "hourConfigs": [{
        "role": "Teórico",
        "total_hours": 100,
      },
      {
        "role": "Tecnología",
        "total_hours": 20,
      }],
    "needs":[{
        "name": "laboratorio"
    },{
        "name": "salon de 25 personas"
    }],
    "needs_notes": "",
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
      { id: 1, associated_coordinator: 101, associated_teacher: 1 },
      { id: 2, associated_coordinator: 101, associated_teacher: 2 }
    ];
    const mockTeacher1 = { id: 1, name: 'John', surname: 'Doe' };
    const mockTeacher2 = { id: 2, name: 'Jane', surname: 'Smith' };
    const mockCoordinator = { id: 101, name: 'Adam', surname: 'Smith' };

    const mockSubjectDto1 = { id: 1, associated_teacher_name: 'John Doe', associated_teacher: 1, associated_coordinator_name:  'Adam Smith', associated_coordinator: 101, name: undefined, subject_code: undefined, study_plan_year: undefined, index: undefined, hourConfigs: undefined };
    const mockSubjectDto2 = { id: 2, associated_teacher_name: 'Jane Smith', associated_teacher: 2, associated_coordinator_name:  'Adam Smith', associated_coordinator: 101, name: undefined, subject_code: undefined, study_plan_year: undefined, index: undefined, hourConfigs: undefined };

    (getSubjects as jest.Mock).mockResolvedValue(mockSubjects);
    (getTeacherById as jest.Mock)
      .mockResolvedValueOnce(mockTeacher1)
      .mockResolvedValueOnce(mockCoordinator)
      .mockResolvedValueOnce(mockTeacher2)
      .mockResolvedValueOnce(mockCoordinator);

    await subjectController.getSubjects(req as Request, res as Response);

    expect(getSubjects).toHaveBeenCalledWith({}, undefined, undefined, undefined, undefined);
    expect(getTeacherById).toHaveBeenCalledWith(1);
    expect(getTeacherById).toHaveBeenCalledWith(101);
    expect(getTeacherById).toHaveBeenCalledWith(2);
    expect(getTeacherById).toHaveBeenCalledWith(101);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith([mockSubjectDto1, mockSubjectDto2]);
  });

});

describe('getSubject', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {
      params: { id: '1' }
    };
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    res = {
      status: statusMock,
      json: jsonMock
    };
    jest.clearAllMocks();
  });

  it('should return subject with teacher names if found', async () => {
    const mockSubject = { id: 1, associated_teacher: 101, associated_coordinator: 102 };
    const mockTeacher1 = { id: 101, name: 'John', surname: 'Doe' };
    const mockTeacher2 = { id: 102, name: 'Jane', surname: 'Smith' };
    const mockSubjectDto = { 
      id: 1, 
      associated_teacher_name: 'John Doe', 
      associated_coordinator_name: 'Jane Smith',
      // Add other properties as needed
    };

    (getSubjectById as jest.Mock).mockResolvedValue(mockSubject);
    (getTeacherById as jest.Mock)
      .mockResolvedValueOnce(mockTeacher1)
      .mockResolvedValueOnce(mockTeacher2);

    await subjectController.getSubject(req as Request, res as Response);

    expect(getSubjectById).toHaveBeenCalledWith(1);
    expect(getTeacherById).toHaveBeenCalledWith(101);
    expect(getTeacherById).toHaveBeenCalledWith(102);

    // Manually create the expected DTO
    const expectedDto = {
      id: mockSubject.id,
      associated_teacher_name: `${mockTeacher1.name} ${mockTeacher1.surname}`,
      associated_teacher: 101,
      associated_coordinator_name: `${mockTeacher2.name} ${mockTeacher2.surname}`,
      associated_coordinator: 102,
    };

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(expectedDto);
  });

  it('should handle errors', async () => {
    const error = new Error('Something went wrong');
    (getSubjectById as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await subjectController.getSubject(req as Request, res as Response);

    expect(getSubjectById).toHaveBeenCalledWith(1);
    expect(returnError).toHaveBeenCalledWith(res, error);
  });

  it('should handle errors', async () => {
    const error = new Error('Something went wrong');
    (getSubjectById as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await subjectController.getSubject(req as Request, res as Response);

    expect(getSubjectById).toHaveBeenCalledWith(1);
    expect(returnError).toHaveBeenCalledWith(res, error);
  });

});