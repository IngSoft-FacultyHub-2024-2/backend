import { Request, Response } from 'express';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';
import teacherController from '../../src/controllers/teacherController';
import { getTeachers, addTeacher, getBenefits, getCategories, getAllTeachersNames, dismissTeacher } from '../../src/modules/teacher';

jest.mock('../../src/modules/teacher');
jest.mock('../../src/modules/subject');
jest.mock('../../src/shared/utils/exceptions/handleExceptions');

describe('TeacherController', () => {
  let teacherBody: any = {
    "name": "John",
    "surname": "Doe7",
    "birth_date": "1985-05-15",
    "employee_number": 2234577,
    "cv_file": "https://example.com/cv/john_doe.pdf",
    "how_they_found_us": "LinkedIn",
    "id_photo": "https://example.com/photos/john_doe.jpg",
    "hiring_date": "2023-01-15",
    "contact_hours": "9:00 AM - 5:00 PM",
    "linkedin_link": "https://linkedin.com/in/johndoe",
    "graduated": true,
    "notes": "Experienced in various technologies.",
    "prizes": [
      {
        "name": "Best Teacher Award",
        "year": "2022-01-01"
      }
    ],
    "caes_courses": [
      {
        "name": "Advanced Teaching Methods",
        "date": "2021-08-10"
      }
    ],
    "contacts": [
      {
        "mean": "Email",
        "data": "johndoe@example7.com",
        "prefered": true
      },
      {
        "mean": "Phone",
        "data": "+12345678907",
        "prefered": false
      }
    ],
    "categories": [{ "category_id": 1 }],
    "benefits": [{ "benefit_id": 1 }],
    "subjects_history": [
      {
        "subject_id": 2,
        "role": "Tecnología",
        "start_date": "2022-09-01",
        "end_date": null
      }
    ],
    "subjects_of_interest": [1]
  };

  const mockReq = { body: teacherBody } as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a teacher successfully', async () => {
    (addTeacher as jest.Mock).mockResolvedValue({ id: 1, ...teacherBody });

    await teacherController.addTeacher(mockReq, mockRes);

    expect(addTeacher).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ id: 1, ...teacherBody });
  });

  it('should handle errors when adding a teacher fails', async () => {
    const error = new Error('Something went wrong');
    (addTeacher as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await teacherController.addTeacher(mockReq, mockRes);

    expect(addTeacher).toHaveBeenCalledWith(mockReq.body);
    expect(returnError).toHaveBeenCalledWith(mockRes, error);
  });

  describe('getTeachers', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
      req = { query: {} };
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      res = { status: statusMock, json: jsonMock };
      jest.clearAllMocks();
    });

    it('should return a list of teachers with associated subjects', async () => {
      const mockTeachers = {
        teachers: [
          { id: 1, name: 'John', surname: 'Doe', subjects_history: [{ subject_id: 101 }] },
          { id: 2, name: 'Jane', surname: 'Smith', subjects_history: [{ subject_id: 102 }] }
        ],
        totalPages: 1,
        currentPage: 1
      };

      (getTeachers as jest.Mock).mockResolvedValue(mockTeachers);

      await teacherController.getTeachers(req as Request, res as Response);

      expect(getTeachers).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, undefined, undefined);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockTeachers);
    });

    it('should accept queries and return a list of teachers with associated subjects', async () => {
      const mockTeachers = {
        teachers: [
          { id: 1, name: 'John', surname: 'Doe', subjects_history: [{ subject_id: 101 }] },
          { id: 2, name: 'Jane', surname: 'Smith', subjects_history: [{ subject_id: 102 }] }
        ],
        totalPages: 1,
        currentPage: 1
      };

      (getTeachers as jest.Mock).mockResolvedValue(mockTeachers);

      const req = {
        query: {
          search: 'John',
          state: 'active',
          sortField: 'name',
          sortOrder: 'ASC',
          page: 1,
          pageSize: 10
        }
      };

      await teacherController.getTeachers(req, res as Response);

      expect(getTeachers).toHaveBeenCalledWith('John', 'active', 'name', 'ASC', 1, 10);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockTeachers);
    });

    it('should handle errors', async () => {
      const error = new Error('Something went wrong');
      (getTeachers as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await teacherController.getTeachers(req as Request, res as Response);

      expect(getTeachers).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, undefined, undefined);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('getAllTeachersNames', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it('should return all teachers names with status 200', async () => {
      const teachers = [{ id: 1, name: 'John', surname: 'Doe' }, { id: 1, name: 'Jane', surname: 'Smith' }];
      (getAllTeachersNames as jest.Mock).mockResolvedValue(teachers);

      await teacherController.getAllTeachersNames(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(teachers);
    });
  });

  describe('dismissTeacher', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
      req = { params: { id: "1" } };
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      res = { status: statusMock, json: jsonMock };
      jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    });

    it('should dismiss a teacher successfully', async () => {
      (dismissTeacher as jest.Mock).mockResolvedValue({ id: 1, ...teacherBody });

      await teacherController.dismissTeacher(req as Request, res as Response);

      expect(dismissTeacher).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(204);
    });

    it('should handle errors when dismissing a teacher fails', async () => {
      const error = new Error('Something went wrong');
      (dismissTeacher as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await teacherController.dismissTeacher(req as Request, res as Response);

      expect(dismissTeacher).toHaveBeenCalledWith(1);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('getBenefits', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
      req = { query: {} };
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      res = { status: statusMock, json: jsonMock };
      jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    });

    it('should return a list of benefits', async () => {
      const mockBenefits = [{ id: 1, name: 'Health Insurance' }];
      // Asegúrate de que la función `getBenefits` sea un mock.
      (getBenefits as jest.Mock).mockResolvedValue(mockBenefits);

      await teacherController.getBenefits(req as Request, res as Response);

      // Verifica que la función mockeada `getBenefits` fue llamada.
      expect(getBenefits).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockBenefits);
    });

    it('should handle errors when fetching benefits fails', async () => {
      const error = new Error('Something went wrong');
      // Simula un error cuando se llama a `getBenefits`.
      (getBenefits as jest.Mock).mockRejectedValue(error);

      await teacherController.getBenefits(req as Request, res as Response);

      expect(getBenefits).toHaveBeenCalledTimes(1);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('getCategories', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
      req = { query: {} };
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      res = { status: statusMock, json: jsonMock };
      jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    });

    it('should return a list of categories', async () => {
      const mockCategories = [{ id: 1, name: 'Full-Time' }];
      // Asegúrate de que la función `getCategories` sea un mock.
      (getCategories as jest.Mock).mockResolvedValue(mockCategories);

      await teacherController.getCategories(req as Request, res as Response);

      // Verifica que la función mockeada `getCategories` fue llamada.
      expect(getCategories).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockCategories);
    });

    it('should handle errors when fetching categories fails', async () => {
      const error = new Error('Something went wrong');
      // Simula un error cuando se llama a `getCategories`.
      (getCategories as jest.Mock).mockRejectedValue(error);

      await teacherController.getCategories(req as Request, res as Response);

      expect(getCategories).toHaveBeenCalledTimes(1);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });
  });

});