import { Request, Response } from 'express';
import studyPlanController from '../../src/controllers/studyPlanController';
import {
  addStudyPlan,
  deleteStudyPlan,
  getStudyPlans,
  updateStudyPlan,
} from '../../src/modules/subject';

jest.mock('../../src/modules/subject');

describe('StudyPlanController', () => {
  let mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStudyPlans', () => {
    it('retrieves study plans successfully with filters and sorting', async () => {
      const mockStudyPlans = [{ id: 1, year: 2024 }];
      const queryParams = { sortField: 'year', sortOrder: 'asc' };

      mockReq.query = queryParams;
      (getStudyPlans as jest.Mock).mockResolvedValue(mockStudyPlans);

      await studyPlanController.getStudyPlans(mockReq, mockRes);

      expect(getStudyPlans).toHaveBeenCalledWith({}, undefined, 'year', 'asc');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockStudyPlans);
    });

    it('handles error when retrieving study plans', async () => {
      const mockError = new Error('Failed to fetch study plans');
      mockReq.query = {};
      (getStudyPlans as jest.Mock).mockRejectedValue(mockError);

      await studyPlanController.getStudyPlans(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to fetch study plans',
      });
    });
  });

  describe('addStudyPlan', () => {
    it('creates a study plan successfully', async () => {
      const mockStudyPlan = { id: 1, year: 2024 };
      mockReq.body = mockStudyPlan;
      (addStudyPlan as jest.Mock).mockResolvedValue(mockStudyPlan);

      await studyPlanController.addStudyPlan(mockReq, mockRes);

      expect(addStudyPlan).toHaveBeenCalledWith(mockStudyPlan);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockStudyPlan);
    });

    it('handles error when creating a study plan', async () => {
      const mockError = new Error('Failed to create study plan');
      mockReq.body = { year: 2024 };
      (addStudyPlan as jest.Mock).mockRejectedValue(mockError);

      await studyPlanController.addStudyPlan(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to create study plan',
      });
    });
  });

  describe('updateStudyPlan', () => {
    it('updates a study plan successfully', async () => {
      const mockStudyPlan = { id: 1, year: 2025 };
      mockReq.params = { id: '1' };
      mockReq.body = mockStudyPlan;
      (updateStudyPlan as jest.Mock).mockResolvedValue(mockStudyPlan);

      await studyPlanController.updateStudyPlan(mockReq, mockRes);

      expect(updateStudyPlan).toHaveBeenCalledWith(1, mockStudyPlan);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockStudyPlan);
    });

    it('handles error when updating a study plan', async () => {
      const mockError = new Error('Failed to update study plan');
      mockReq.params = { id: '1' };
      mockReq.body = { year: 2025 };
      (updateStudyPlan as jest.Mock).mockRejectedValue(mockError);

      await studyPlanController.updateStudyPlan(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to update study plan',
      });
    });
  });

  describe('deleteStudyPlan', () => {
    it('deletes a study plan successfully', async () => {
      mockReq.params = { id: '1' };
      (deleteStudyPlan as jest.Mock).mockResolvedValue(undefined);

      await studyPlanController.deleteStudyPlan(mockReq, mockRes);

      expect(deleteStudyPlan).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('handles error when deleting a study plan', async () => {
      const mockError = new Error('Failed to delete study plan');
      mockReq.params = { id: '1' };
      (deleteStudyPlan as jest.Mock).mockRejectedValue(mockError);

      await studyPlanController.deleteStudyPlan(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to delete study plan',
      });
    });
  });
});
