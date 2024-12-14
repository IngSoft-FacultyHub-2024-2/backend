import { Request, Response } from 'express';
import needController from '../../src/controllers/needController';
import inputNeedSchema from '../../src/controllers/validationSchemas/subjectSchemas/inputNeedSchema';
import {
  addNeed,
  deleteNeed,
  getNeeds,
  updateNeed,
} from '../../src/modules/subject';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';

jest.mock('../../src/modules/subject');
jest.mock('../../src/shared/utils/exceptions/handleExceptions');
jest.mock(
  '../../src/controllers/validationSchemas/subjectSchemas/inputNeedSchema',
  () => ({
    validate: jest.fn(),
  })
);

describe('NeedController', () => {
  let mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addNeed', () => {
    it('should create a need successfully', async () => {
      const mockNeed = { id: 1, name: 'whiteboard' };
      mockReq.body = mockNeed;
      (inputNeedSchema.validate as jest.Mock).mockResolvedValue(mockNeed);
      (addNeed as jest.Mock).mockResolvedValue(mockNeed);

      await needController.addNeed(mockReq, mockRes);

      expect(inputNeedSchema.validate).toHaveBeenCalledWith(mockNeed);
      expect(addNeed).toHaveBeenCalledWith(mockNeed);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockNeed);
    });

    it('should handle validation error', async () => {
      const validationError = new Error('Validation failed');
      mockReq.body = { name: '' };
      (inputNeedSchema.validate as jest.Mock).mockRejectedValue(
        validationError
      );

      await needController.addNeed(mockReq, mockRes);

      expect(inputNeedSchema.validate).toHaveBeenCalledWith(mockReq.body);
      expect(returnError).toHaveBeenCalledWith(mockRes, validationError);
    });
  });

  describe('getNeeds', () => {
    it('should retrieve needs successfully', async () => {
      const mockNeeds = [{ id: 1, name: 'whiteboard' }];
      mockReq.query = { sortField: 'name', sortOrder: 'asc' };
      (getNeeds as jest.Mock).mockResolvedValue(mockNeeds);

      await needController.getNeeds(mockReq, mockRes);

      expect(getNeeds).toHaveBeenCalledWith({}, undefined, 'name', 'asc');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockNeeds);
    });

    it('should handle error while retrieving needs', async () => {
      const fetchError = new Error('Failed to fetch needs');
      (getNeeds as jest.Mock).mockRejectedValue(fetchError);

      await needController.getNeeds(mockReq, mockRes);

      expect(returnError).toHaveBeenCalledWith(mockRes, fetchError);
    });
  });

  describe('updateNeed', () => {
    it('should update a need successfully', async () => {
      const mockNeed = { id: 1, name: 'Updated whiteboard' };
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated whiteboard' };
      (inputNeedSchema.validate as jest.Mock).mockResolvedValue(mockReq.body);
      (updateNeed as jest.Mock).mockResolvedValue(mockNeed);

      await needController.updateNeed(mockReq, mockRes);

      expect(inputNeedSchema.validate).toHaveBeenCalledWith(mockReq.body);
      expect(updateNeed).toHaveBeenCalledWith(1, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockNeed);
    });

    it('should handle error while updating a need', async () => {
      const updateError = new Error('Failed to update need');
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Invalid data' };
      (inputNeedSchema.validate as jest.Mock).mockResolvedValue(mockReq.body);
      (updateNeed as jest.Mock).mockRejectedValue(updateError);

      await needController.updateNeed(mockReq, mockRes);

      expect(returnError).toHaveBeenCalledWith(mockRes, updateError);
    });
  });

  describe('deleteNeed', () => {
    it('should delete a need successfully', async () => {
      mockReq.params = { id: '1' };
      (deleteNeed as jest.Mock).mockResolvedValue(undefined);

      await needController.deleteNeed(mockReq, mockRes);

      expect(deleteNeed).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should handle error while deleting a need', async () => {
      const deleteError = new Error('Failed to delete need');
      mockReq.params = { id: '1' };
      (deleteNeed as jest.Mock).mockRejectedValue(deleteError);

      await needController.deleteNeed(mockReq, mockRes);

      expect(returnError).toHaveBeenCalledWith(mockRes, deleteError);
    });
  });
});
