import { Request, Response } from 'express';
import { getStudyPlans, addStudyPlan } from '../../src/modules/subject';
import studyPlanController from '../../src/controllers/studyPlanController';

jest.mock('../../src/modules/subject');

describe('StudyPlanController', () => {
  let mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retrieves studyPlans successfully with filters, sorting', async () => {
    // Arrange
    const mockStudyPlans = [{ id: 1, year: 2024 }];
    const queryParams = { sortField: 'year', sortOrder: 'asc'};

    mockReq.query = queryParams;
    (getStudyPlans as jest.Mock).mockResolvedValue(mockStudyPlans);

    // Act
    await studyPlanController.getStudyPlans(mockReq, mockRes)

    // Assert
    expect(getStudyPlans).toHaveBeenCalledWith({}, undefined, 'year', 'asc');
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockStudyPlans);
  });

  it('should create an studyPlan successfully', async () => {
    const mockStudyPlan = { id: 1, year: 2024 };
    mockReq.body = mockStudyPlan;
    (addStudyPlan as jest.Mock).mockImplementation(async () => {
      return mockStudyPlan;
    });

    await studyPlanController.addStudyPlan(mockReq, mockRes);

    expect(addStudyPlan).toHaveBeenCalledWith(mockStudyPlan);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockStudyPlan);
  });

  it('should handle error when creating an studyPlan', async () => {
    const mockError = new Error('Failed to create studyPlan');
    mockReq.body = { year: 2024 };
    (addStudyPlan as jest.Mock).mockImplementation(async () => {
      throw mockError;
    });

    await studyPlanController.addStudyPlan(mockReq, mockRes);

    expect(addStudyPlan).toHaveBeenCalledWith({  year: 2024 });
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to create studyPlan' });
  });
});