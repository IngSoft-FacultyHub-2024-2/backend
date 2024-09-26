import { Request, Response } from 'express';
import { getNeeds, addNeed } from '../../src/modules/subject';
import needController from '../../src/controllers/needController';

jest.mock('../../src/modules/subject');

describe('NeedController', () => {
  let mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retrieves needs successfully', async () => {
    // Arrange
    const mockNeeds = [{ id: 1, name: "whiteboard" }];
    (getNeeds as jest.Mock).mockResolvedValue(mockNeeds);
    const queryParams = { sortField: 'name', sortOrder: 'asc'};
    mockReq.query = queryParams;

    // Act
    await needController.getNeeds(mockReq, mockRes)

    // Assert
    expect(getNeeds).toHaveBeenCalledWith({}, undefined, "name", "asc");
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockNeeds);
  });

  it('should create an need successfully', async () => {
    const mockNeed = { id: 1, name: "whiteboard" };
    mockReq.body = mockNeed;
    (addNeed as jest.Mock).mockImplementation(async () => {
      return mockNeed;
    });

    await needController.addNeed(mockReq, mockRes);

    expect(addNeed).toHaveBeenCalledWith(mockNeed);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockNeed);
  });

  it('should handle error when creating an need', async () => {
    const mockError = new Error('Failed to create need');
    mockReq.body = { name: "whiteboard" };
    (addNeed as jest.Mock).mockImplementation(async () => {
      throw mockError;
    });

    await needController.addNeed(mockReq, mockRes);

    expect(addNeed).toHaveBeenCalledWith({  name: "whiteboard" });
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to create need' });
  });
});