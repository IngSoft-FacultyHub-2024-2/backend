import { Request, Response } from 'express';
import { getBenefits, getCategories } from '../../src/modules/teacher/services/teacherService';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';
import teacherController from '../../src/controllers/teacherController';
import { getTeachers, addTeacher } from '../../src/modules/teacher';
import { getSubjectById } from '../../src/modules/subject';

jest.mock('../../src/modules/teacher');
jest.mock('../../src/modules/teacher/services/teacherService');
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
      req = {
        query: {}
      };
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      res = {
        status: statusMock,
        json: jsonMock
      };
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
      const mockSubject1 = { id: 101, name: 'Math' };
      const mockSubject2 = { id: 102, name: 'Science' };
      const mockTeacherSummaryDto1 = { id: 1, name: 'John', surname: 'Doe', associated_subjects: ['Math'] };
      const mockTeacherSummaryDto2 = { id: 2, name: 'Jane', surname: 'Smith', associated_subjects: ['Science'] };

      (getTeachers as jest.Mock).mockResolvedValue(mockTeachers);
      (getSubjectById as jest.Mock)
        .mockResolvedValueOnce(mockSubject1)
        .mockResolvedValueOnce(mockSubject2);

      await teacherController.getTeachers(req as Request, res as Response);

      expect(getTeachers).toHaveBeenCalledWith(undefined, undefined, undefined, 1, 10);
      expect(getSubjectById).toHaveBeenCalledWith(101);
      expect(getSubjectById).toHaveBeenCalledWith(102);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ teachers: [mockTeacherSummaryDto1, mockTeacherSummaryDto2], totalPages: 1, currentPage: 1 });
    });

    it('should handle errors', async () => {
      const error = new Error('Something went wrong');
      (getTeachers as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await teacherController.getTeachers(req as Request, res as Response);

      expect(getTeachers).toHaveBeenCalledWith(undefined, undefined, undefined, 1, 10);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('getBenefits', () => {
    it('should return a list of benefits', async () => {
      const mockBenefits = [{ id: 1, name: 'Health Insurance' }];
      (getBenefits as jest.Mock).mockResolvedValue(mockBenefits);

      await teacherController.getBenefits(mockReq, mockRes);

      expect(getBenefits).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockBenefits);
    });

    it('should handle errors when fetching benefits fails', async () => {
      const error = new Error('Something went wrong');
      (getBenefits as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await teacherController.getBenefits(mockReq, mockRes);

      expect(getBenefits).toHaveBeenCalled();
      expect(returnError).toHaveBeenCalledWith(mockRes, error);
    });
  });

  describe('getCategories', () => {
    it('should return a list of categories', async () => {
      const mockCategories = [{ id: 1, name: 'Full-Time' }];
      (getCategories as jest.Mock).mockResolvedValue(mockCategories);

      await teacherController.getCategories(mockReq, mockRes);

      expect(getCategories).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockCategories);
    });

    it('should handle errors when fetching categories fails', async () => {
      const error = new Error('Something went wrong');
      (getCategories as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await teacherController.getCategories(mockReq, mockRes);

      expect(getCategories).toHaveBeenCalled();
      expect(returnError).toHaveBeenCalledWith(mockRes, error);
    });
  });
});
