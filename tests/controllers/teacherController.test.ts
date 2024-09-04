import { Request, Response } from 'express';

jest.mock('../../src/modules/subject');
import teacherController from '../../src/controllers/teacherController';
import * as teacherModule from '../../src/modules/teacher';

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
    // Asegúrate de que jest.mock está interceptando correctamente addTeacher
    jest.spyOn(teacherModule, 'addTeacher').mockImplementation(async (teacher: Partial<any>) => {
      return { id: 1, ...teacherBody };
    });

    await teacherController.addTeacher(mockReq, mockRes);

    expect(teacherModule.addTeacher).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ id: 1, ...teacherBody });
  });

  it('should handle errors when adding a teacher fails', async () => {
    mockReq.body = {};
    await teacherController.addTeacher(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});