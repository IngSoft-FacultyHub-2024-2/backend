import { Request, Response } from 'express';

import { getSubjectById } from '../../src/modules/subject';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';
import teacherController from '../../src/controllers/teacherController';
import {getTeachers, addTeacher} from '../../src/modules/teacher';


jest.mock('../../src/modules/subject');
jest.mock('../../src/modules/teacher');
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
    "categories": [1],
    "benefits": [1],
    "subjects": [
      {
        "subject_id": 2,
        "role": "Tecnología",
        "start_date": "2022-09-01",
        "end_date": null
      }
    ],
    "subjects_of_interest": [1]
  }
  ;
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
    const mockTeachers = [
      { id: 1, name: 'John', surname: 'Doe', subjects: [{ subject_id: 101 }] },
      { id: 2, name: 'Jane', surname: 'Smith', subjects: [{ subject_id: 102 }] }
    ];
    const mockSubject1 = { id: 101, name: 'Math' };
    const mockSubject2 = { id: 102, name: 'Science' };
    const mockTeacherSummaryDto1 = { id: 1, name: 'John', surname: 'Doe', associated_subjects: ['Math'] };
    const mockTeacherSummaryDto2 = { id: 2, name: 'Jane', surname: 'Smith', associated_subjects: ['Science'] };

    (getTeachers as jest.Mock).mockResolvedValue(mockTeachers);
    (getSubjectById as jest.Mock)
      .mockResolvedValueOnce(mockSubject1)
      .mockResolvedValueOnce(mockSubject2);

    await teacherController.getTeachers(req as Request, res as Response);

    expect(getTeachers).toHaveBeenCalledWith({}, undefined, undefined, undefined, undefined);
    expect(getSubjectById).toHaveBeenCalledWith(101);
    expect(getSubjectById).toHaveBeenCalledWith(102);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith([mockTeacherSummaryDto1, mockTeacherSummaryDto2]);
  });

  it('should handle errors', async () => {
    const error = new Error('Something went wrong');
    (getTeachers as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await teacherController.getTeachers(req as Request, res as Response);

    expect(getTeachers).toHaveBeenCalledWith({}, undefined, undefined, undefined, undefined);
    expect(returnError).toHaveBeenCalledWith(res, error);
  });
});