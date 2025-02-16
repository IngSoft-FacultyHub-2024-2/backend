import { Request, Response } from 'express';
import SemesterController from '../../src/controllers/semesterController';
import inputLectureSchema from '../../src/controllers/validationSchemas/lectureSchemas/inputLectureSchema';
import inputSemesterSchema from '../../src/controllers/validationSchemas/semesterSchemas/inputSemesterSchema';
import {
  addLecture,
  addSemester,
  deleteLecture,
  getSemesterLectures,
  getSemesterLecturesGroups,
  getSemesters,
  updateLecture,
} from '../../src/modules/semester';
import { getRoleById } from '../../src/modules/userManagement';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';

jest.mock('../../src/modules/semester');
jest.mock('../../src/shared/utils/exceptions/handleExceptions');
jest.mock(
  '../../src/controllers/validationSchemas/lectureSchemas/inputLectureSchema'
);
jest.mock(
  '../../src/controllers/validationSchemas/semesterSchemas/inputSemesterSchema'
);
jest.mock('../../src/modules/userManagement');

describe('SemesterController', () => {
  let mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a semester successfully', async () => {
    const mockSemester = { id: 1, name: 'Fall 2023' };
    mockReq.body = mockSemester;
    (inputSemesterSchema.validate as jest.Mock).mockResolvedValue(true);
    (addSemester as jest.Mock).mockResolvedValue(mockSemester);

    await SemesterController.addSemester(mockReq, mockRes);

    expect(inputSemesterSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(addSemester).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockSemester);
  });

  it('handles validation error when creating a semester', async () => {
    const mockValidationError = new Error('Validation error');
    (inputSemesterSchema.validate as jest.Mock).mockRejectedValue(
      mockValidationError
    );

    await SemesterController.addSemester(mockReq, mockRes);

    expect(inputSemesterSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(returnError).toHaveBeenCalledWith(mockRes, mockValidationError);
  });

  it('handles error when creating a semester', async () => {
    const mockError = new Error('Failed to create semester');
    mockReq.body = { name: 'Fall 2023' };
    (inputSemesterSchema.validate as jest.Mock).mockResolvedValue(true);
    (addSemester as jest.Mock).mockRejectedValue(mockError);

    await SemesterController.addSemester(mockReq, mockRes);

    expect(inputSemesterSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(addSemester).toHaveBeenCalledWith(mockReq.body);
    expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
  });

  it('retrieves semesters successfully', async () => {
    const mockSemesters = [{ id: 1, name: 'Fall 2023' }];
    (getSemesters as jest.Mock).mockResolvedValue(mockSemesters);

    await SemesterController.getSemesters(mockReq, mockRes);

    expect(getSemesters).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockSemesters);
  });

  it('handles error when retrieving semesters', async () => {
    const mockError = new Error('Failed to retrieve semesters');
    (getSemesters as jest.Mock).mockRejectedValue(mockError);

    await SemesterController.getSemesters(mockReq, mockRes);

    expect(getSemesters).toHaveBeenCalled();
    expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
  });

  it('creates a lecture successfully', async () => {
    const mockLecture = { id: 1, name: 'Lecture 1' };
    mockReq.body = mockLecture;
    (inputLectureSchema.validate as jest.Mock).mockResolvedValue(true);
    (addLecture as jest.Mock).mockResolvedValue(mockLecture);

    await SemesterController.addLecture(mockReq, mockRes);

    expect(inputLectureSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(addLecture).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockLecture);
  });

  it('handles validation error when creating a lecture', async () => {
    const mockValidationError = new Error('Validation error');
    (inputLectureSchema.validate as jest.Mock).mockRejectedValue(
      mockValidationError
    );

    await SemesterController.addLecture(mockReq, mockRes);

    expect(inputLectureSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(returnError).toHaveBeenCalledWith(mockRes, mockValidationError);
  });

  it('handles error when creating a lecture', async () => {
    const mockError = new Error('Failed to create lecture');
    mockReq.body = { name: 'Lecture 1' };
    (inputLectureSchema.validate as jest.Mock).mockResolvedValue(true);
    (addLecture as jest.Mock).mockRejectedValue(mockError);

    await SemesterController.addLecture(mockReq, mockRes);

    expect(inputLectureSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(addLecture).toHaveBeenCalledWith(mockReq.body);
    expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
  });
});

describe('SemesterController.getLectures', () => {
  let mockReq = {} as any;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retrieves lectures for a semester successfully as a teacher', async () => {
    const mockLectures = [{ id: 1, name: 'Lecture 1' }];
    mockReq.params = { semesterId: '1' };
    mockReq.query = { degreeId: '2', subjectId: '3', group: 'A' };
    mockReq.user = { role: 2, teacher_id: 10 }; // Simulamos un usuario con rol de teacher

    const mockTeacherRole = { id: 2, name: 'teacher' };
    (getRoleById as jest.Mock).mockResolvedValue(mockTeacherRole);
    (getSemesterLectures as jest.Mock).mockResolvedValue(mockLectures);

    await SemesterController.getLectures(mockReq, mockRes);

    expect(getRoleById).toHaveBeenCalledWith(2);
    expect(getSemesterLectures).toHaveBeenCalledWith('1', '2', '3', 'A', 10);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockLectures);
  });

  it('retrieves lectures for a semester successfully as a coordinator', async () => {
    const mockLectures = [{ id: 1, name: 'Lecture 1' }];
    mockReq.params = { semesterId: '1' };
    mockReq.query = { degreeId: '2', subjectId: '3', group: 'A' };
    mockReq.user = { role: 1 }; // Simulamos un usuario con rol de coordinator

    const mockCoordinatorRole = { id: 1, name: 'coordinator' };
    (getRoleById as jest.Mock).mockResolvedValue(mockCoordinatorRole);
    (getSemesterLectures as jest.Mock).mockResolvedValue(mockLectures);

    await SemesterController.getLectures(mockReq, mockRes);

    expect(getRoleById).toHaveBeenCalledWith(1);
    expect(getSemesterLectures).toHaveBeenCalledWith('1', '2', '3', 'A'); // Sin teacher_id
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockLectures);
  });

  it('handles error when retrieving lectures for a semester', async () => {
    const mockError = new Error('Failed to retrieve lectures');
    mockReq.params = { semesterId: '1' };
    mockReq.query = { degreeId: '2', subjectId: '3', group: 'A' };
    mockReq.user = { role: 1 };

    const mockCoordinatorRole = { id: 1, name: 'coordinator' };
    (getRoleById as jest.Mock).mockResolvedValue(mockCoordinatorRole);
    (getSemesterLectures as jest.Mock).mockRejectedValue(mockError);

    await SemesterController.getLectures(mockReq, mockRes);

    expect(getRoleById).toHaveBeenCalledWith(1);
    expect(getSemesterLectures).toHaveBeenCalledWith('1', '2', '3', 'A');
    expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
  });
});

describe('getLecturesGroups', () => {
  const mockReq: any = {
    params: { semesterId: 1 },
    query: { degreeId: 2 },
  };
  const mockRes: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockLectureGroups = [
    { id: 1, group: 'A' },
    { id: 2, group: 'B' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should respond with lecture groups on success', async () => {
    (getSemesterLecturesGroups as jest.Mock).mockResolvedValue(
      mockLectureGroups
    );

    await SemesterController.getLecturesGroups(mockReq, mockRes);

    expect(getSemesterLecturesGroups).toHaveBeenCalledWith(1, 2);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockLectureGroups);
  });

  it('should handle errors and call returnError on failure', async () => {
    const mockError = new Error('Some error');
    (getSemesterLecturesGroups as jest.Mock).mockRejectedValue(mockError);

    await SemesterController.getLecturesGroups(mockReq, mockRes);

    expect(getSemesterLecturesGroups).toHaveBeenCalledWith(1, 2);
    expect(mockRes.status).not.toHaveBeenCalledWith(200);
    expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
  });
});

describe('updateLecture', () => {
  const mockReq: Partial<Request> = {
    params: { id: '1' },
    body: { name: 'Updated Lecture' },
  };
  const mockRes: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a lecture and respond with the updated lecture', async () => {
    const mockUpdatedLecture = { id: 1, name: 'Updated Lecture' };

    // Mock validations and service call
    (inputLectureSchema.validate as jest.Mock).mockResolvedValue(true);
    (updateLecture as jest.Mock).mockResolvedValue(mockUpdatedLecture);

    await SemesterController.updateLecture(
      mockReq as Request,
      mockRes as Response
    );

    expect(inputLectureSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(updateLecture).toHaveBeenCalledWith(1, mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedLecture);
  });

  it('should handle validation errors and call returnError', async () => {
    const mockValidationError = new Error('Validation Error');

    // Mock validation failure
    (inputLectureSchema.validate as jest.Mock).mockRejectedValue(
      mockValidationError
    );

    await SemesterController.updateLecture(
      mockReq as Request,
      mockRes as Response
    );

    expect(inputLectureSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(updateLecture).not.toHaveBeenCalled();
    expect(returnError).toHaveBeenCalledWith(mockRes, mockValidationError);
  });
});

describe('deleteLecture', () => {
  const mockReq: Partial<Request> = {
    params: { id: '1' },
  };
  const mockRes: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a lecture and respond with status 200', async () => {
    // Mock the service call
    const mockDeletedLecture = {
      id: 1,
      message: 'Lecture deleted successfully',
    };
    (deleteLecture as jest.Mock).mockResolvedValue(mockDeletedLecture);

    await SemesterController.deleteLecture(
      mockReq as Request,
      mockRes as Response
    );

    expect(deleteLecture).toHaveBeenCalledWith(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockDeletedLecture);
  });

  it('should handle errors and call returnError', async () => {
    const mockError = new Error('Lecture not found');

    // Mock the service call to throw an error
    (deleteLecture as jest.Mock).mockRejectedValue(mockError);

    await SemesterController.deleteLecture(
      mockReq as Request,
      mockRes as Response
    );

    expect(deleteLecture).toHaveBeenCalledWith(1);
    expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
  });
});
