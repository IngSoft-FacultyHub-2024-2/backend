import { Request, Response } from 'express';
import { getEvents, addEvent } from '../../src/modules/subject';
import eventController from '../../src/controllers/eventController';

jest.mock('../../src/modules/subject');

describe('EventController', () => {
  const mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all events successfully', async () => {
    (getEvents as jest.Mock).mockImplementation(async () => {
      return [{ id: 1, title: 'event1' }];
    });

    await eventController.getEvents(mockReq, mockRes);

    expect(getEvents).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([{ id: 1, title: 'event1' }]);
  });

  it('should create an event successfully', async () => {
    const mockEvent = { id: 1, title: 'event1' };
    mockReq.body = mockEvent;
    (addEvent as jest.Mock).mockImplementation(async () => {
      return mockEvent;
    });

    await eventController.addEvent(mockReq, mockRes);

    expect(addEvent).toHaveBeenCalledWith(mockEvent);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockEvent);
  });

  it('should handle error when creating an event', async () => {
    const mockError = new Error('Failed to create event');
    mockReq.body = { title: 'event1' };
    (addEvent as jest.Mock).mockImplementation(async () => {
      throw mockError;
    });

    await eventController.addEvent(mockReq, mockRes);

    expect(addEvent).toHaveBeenCalledWith({ title: 'event1' });
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to create event' });
  });
});