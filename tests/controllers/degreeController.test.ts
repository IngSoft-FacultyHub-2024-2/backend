import { Request, Response } from 'express';
import DegreeController from '../../src/controllers/degreeController';
import inputDegreeSchema from '../../src/controllers/validationSchemas/degreeSchemas/inputDegreeSchema';
import { addDegree, getDegrees } from '../../src/modules/degree';
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
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retrieves degrees successfully', async () => {
    // Arrange
    const mockDegrees = [{ id: 1, name: 'Computer Science', acronym: 'CS' }];
    (getDegrees as jest.Mock).mockResolvedValue(mockDegrees);

    // Act
    await DegreeController.getDegrees(mockReq, mockRes);

    // Assert
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
});
