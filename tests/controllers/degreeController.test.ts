import { Request, Response } from 'express';
import DegreeController from '../../src/controllers/degreeController';
import inputDegreeSchema from '../../src/controllers/validationSchemas/degreeSchemas/inputDegreeSchema';
import {
  addDegree,
  deleteDegree,
  getDegrees,
  updateDegree,
} from '../../src/modules/degree';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';

jest.mock('../../src/modules/degree');
jest.mock('../../src/shared/utils/exceptions/handleExceptions');
jest.mock(
  '../../src/controllers/validationSchemas/degreeSchemas/inputDegreeSchema'
);

describe('DegreeController', () => {
  let mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {} as Request; // Restablece mockReq para cada test
  });

  it('retrieves degrees successfully', async () => {
    const mockDegrees = [{ id: 1, name: 'Computer Science', acronym: 'CS' }];
    (getDegrees as jest.Mock).mockResolvedValue(mockDegrees);

    await DegreeController.getDegrees(mockReq, mockRes);

    expect(getDegrees).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockDegrees);
  });

  it('handles error when retrieving degrees', async () => {
    const mockError = new Error('Failed to retrieve degrees');
    (getDegrees as jest.Mock).mockRejectedValue(mockError);

    await DegreeController.getDegrees(mockReq, mockRes);

    expect(getDegrees).toHaveBeenCalled();
    expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
  });

  it('creates a degree successfully', async () => {
    const mockDegree = { id: 1, name: 'Computer Science', acronym: 'CS' };
    mockReq.body = { name: 'Computer Science', acronym: 'CS' };
    (inputDegreeSchema.validate as jest.Mock).mockResolvedValue(true);
    (addDegree as jest.Mock).mockResolvedValue(mockDegree);

    await DegreeController.addDegree(mockReq, mockRes);

    expect(inputDegreeSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(addDegree).toHaveBeenCalledWith('Computer Science', 'CS');
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockDegree);
  });

  it('handles validation error when creating a degree', async () => {
    const mockValidationError = new Error('Validation error');
    (inputDegreeSchema.validate as jest.Mock).mockRejectedValue(
      mockValidationError
    );

    await DegreeController.addDegree(mockReq, mockRes);

    expect(inputDegreeSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(returnError).toHaveBeenCalledWith(mockRes, mockValidationError);
  });

  it('handles error when creating a degree', async () => {
    const mockError = new Error('Failed to create degree');
    mockReq.body = { name: 'Computer Science', acronym: 'CS' };
    (inputDegreeSchema.validate as jest.Mock).mockResolvedValue(true);
    (addDegree as jest.Mock).mockRejectedValue(mockError);

    await DegreeController.addDegree(mockReq, mockRes);

    expect(inputDegreeSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(addDegree).toHaveBeenCalledWith('Computer Science', 'CS');
    expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
  });

  it('updates a degree successfully', async () => {
    const mockDegree = { id: 1, name: 'Updated Name', acronym: 'UN' };
    mockReq.params = { id: '1' };
    mockReq.body = { name: 'Updated Name', acronym: 'UN' };
    (inputDegreeSchema.validate as jest.Mock).mockResolvedValue(true);
    (updateDegree as jest.Mock).mockResolvedValue(mockDegree);

    await DegreeController.updateDegree(mockReq, mockRes);

    expect(inputDegreeSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(updateDegree).toHaveBeenCalledWith(1, 'Updated Name', 'UN');
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockDegree);
  });

  it('handles validation error when updating a degree', async () => {
    const mockValidationError = new Error('Validation error');
    mockReq.params = { id: '1' };
    mockReq.body = { name: 'Updated Name', acronym: 'UN' };
    (inputDegreeSchema.validate as jest.Mock).mockRejectedValue(
      mockValidationError
    );

    await DegreeController.updateDegree(mockReq, mockRes);

    expect(inputDegreeSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(returnError).toHaveBeenCalledWith(mockRes, mockValidationError);
  });

  it('handles error when updating a degree', async () => {
    const mockError = new Error('Failed to update degree');
    mockReq.params = { id: '1' };
    mockReq.body = { name: 'Updated Name', acronym: 'UN' };
    (inputDegreeSchema.validate as jest.Mock).mockResolvedValue(true);
    (updateDegree as jest.Mock).mockRejectedValue(mockError);

    await DegreeController.updateDegree(mockReq, mockRes);

    expect(inputDegreeSchema.validate).toHaveBeenCalledWith(mockReq.body);
    expect(updateDegree).toHaveBeenCalledWith(1, 'Updated Name', 'UN');
    expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
  });

  it('deletes a degree successfully', async () => {
    mockReq.params = { id: '1' };

    await DegreeController.deleteDegree(mockReq, mockRes);

    expect(deleteDegree).toHaveBeenCalledWith(1);
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
  });

  it('handles error when deleting a degree', async () => {
    const mockError = new Error('Failed to delete degree');
    mockReq.params = { id: '1' };
    (deleteDegree as jest.Mock).mockRejectedValue(mockError);

    await DegreeController.deleteDegree(mockReq, mockRes);

    expect(deleteDegree).toHaveBeenCalledWith(1);
    expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
  });
});
