import { Request, Response } from 'express';
import { addSubject, getSubjects, getSubjectById, getAllSubjectNames, updateSubject } from '../../src/modules/subject';
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
    "study_plan_id": 1,
    "associated_coordinator": 16,
    "index": 1,
    "frontal_hours": 120,
    "intro_folder": "/src/",
    "subject_folder": "/src/r",
    "technologies": "ruby",
    "notes": "nueva materia",
    "hour_configs": [{
      "role": "Teórico",
      "total_hours": 100,
    },
    {
      "role": "Tecnología",
      "total_hours": 20,
    }],
    "needs": [{
      "name": "laboratorio"
    }, {
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

  describe('addSubjects', () => {
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

    it('should return subjects with correct query parameters', async () => {
      const mockSubjects = {
        subjects: [
          { id: 1, name: 'Math', associated_coordinator: 102 },
          { id: 2, name: 'Physics', associated_coordinator: 103 }
        ],
        totalPages: 1,
        currentPage: 1,
      };

      (getSubjects as jest.Mock).mockResolvedValue(mockSubjects);

      await subjectController.getSubjects(req as Request, res as Response);

      expect(getSubjects).toHaveBeenCalledWith({}, undefined, undefined, undefined, 1, 10, undefined);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockSubjects);
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

    it('should return subject if found', async () => {
      const mockSubject = { id: 1, associated_coordinator: 102 };

      (getSubjectById as jest.Mock).mockResolvedValue(mockSubject);

      await subjectController.getSubject(req as Request, res as Response);

      expect(getSubjectById).toHaveBeenCalledWith(1, true);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockSubject);
    });

    it('should handle errors', async () => {
      const error = new Error('Something went wrong');
      (getSubjectById as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await subjectController.getSubject(req as Request, res as Response);

      expect(getSubjectById).toHaveBeenCalledWith(1, true);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });

    it('should handle errors', async () => {
      const error = new Error('Something went wrong');
      (getSubjectById as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await subjectController.getSubject(req as Request, res as Response);

      expect(getSubjectById).toHaveBeenCalledWith(1, true);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });

  });

  describe('getAllSubjectsNames', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should return all subjects names with status 200', async () => {
      const subjects = [{ id: 1, name: 'Diseño1', acronym: 'DA1', valid: true, study_plan_year: 2024 }, 
        { id: 2, name: 'Diseño2', acronym: 'DA2', valid: true, study_plan_year: 2024 }
      ];
      (getAllSubjectNames as jest.Mock).mockResolvedValue(subjects);

      await subjectController.getAllSubjectNames(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(subjects);
    });
  });

  describe('updateSubject', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      let body: any = {
        "name": "Diseño1",
        "subject_code": "code",
        "acronym": "DA1",
        "study_plan_id": 1,
        "associated_coordinator": 16,
        "index": 1,
        "frontal_hours": 120,
        "intro_folder": "/src/",
        "subject_folder": "/src/r",
        "technologies": "ruby",
        "notes": "nueva materia",
        "hour_configs": [{
          "role": "Teórico",
          "total_hours": 100,
        },
        {
          "role": "Tecnología",
          "total_hours": 20,
        }],
        "needs": [{
          "name": "laboratorio"
        }, {
          "name": "salon de 25 personas"
        }],
        "needs_notes": "",
        "events": []
      };
      req = {
        params: { id: '1' },
        body: { ...body },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should update the subject and return status 200', async () => {
      const updatedSubject = { ...req.body, id: 1, name: 'Math' };
      (updateSubject as jest.Mock).mockResolvedValue(updatedSubject);

      await subjectController.updateSubject(req as Request, res as Response);

      expect(updateSubject).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedSubject);
    });

  });
});
