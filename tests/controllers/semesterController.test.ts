import { Request, Response } from 'express';
import SemesterController from '../../src/controllers/semesterController';
import inputLectureSchema from '../../src/controllers/validationSchemas/lectureSchemas/inputLectureSchema';
import inputSemesterSchema from '../../src/controllers/validationSchemas/semesterSchemas/inputSemesterSchema';
import {
  addLecture,
  addSemester,
  getSemesterLectures,
  getSemesters,
} from '../../src/modules/semester';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';

jest.mock('../../src/modules/semester');
jest.mock('../../src/shared/utils/exceptions/handleExceptions');
jest.mock(
  '../../src/controllers/validationSchemas/lectureSchemas/inputLectureSchema'
);
jest.mock(
  '../../src/controllers/validationSchemas/semesterSchemas/inputSemesterSchema'
);

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

  it('retrieves lectures for a semester successfully', async () => {
    const mockLectures = [{ id: 1, name: 'Lecture 1' }];
    mockReq.params = { semesterId: '1' };
    mockReq.query = { degreeId: '2', subjectId: '3', group: 'A' };
    (getSemesterLectures as jest.Mock).mockResolvedValue(mockLectures);

    await SemesterController.getLectures(mockReq, mockRes);

    expect(getSemesterLectures).toHaveBeenCalledWith('1', '2', '3', 'A');
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockLectures);
  });

  it('handles error when retrieving lectures for a semester', async () => {
    const mockError = new Error('Failed to retrieve lectures');
    mockReq.params = { semesterId: '1' };
    mockReq.query = { degreeId: '2', subjectId: '3', group: 'A' };
    (getSemesterLectures as jest.Mock).mockRejectedValue(mockError);

    await SemesterController.getLectures(mockReq, mockRes);

    expect(getSemesterLectures).toHaveBeenCalledWith('1', '2', '3', 'A');
    expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
  });
});
