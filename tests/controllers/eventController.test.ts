import { Request, Response } from 'express';
import eventController from '../../src/controllers/eventController';
import {
  addEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from '../../src/modules/subject';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';

jest.mock('../../src/modules/subject');
jest.mock('../../src/shared/utils/exceptions/handleExceptions');

describe('EventController', () => {
  let mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    it('should retrieve events successfully with filters, sorting, and pagination', async () => {
      const mockEvents = [{ id: 1, name: 'Event 1' }];
      const queryParams = {
        type: 'conference',
        sortField: 'date',
        sortOrder: 'asc',
        page: '1',
        pageSize: '10',
      };

      mockReq.query = queryParams;
      (getEvents as jest.Mock).mockResolvedValue(mockEvents);

      await eventController.getEvents(mockReq, mockRes);

      expect(getEvents).toHaveBeenCalledWith(
        { type: 'conference' },
        'date',
        'asc',
        1,
        10
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockEvents);
    });

    it('should handle errors when retrieving events', async () => {
      const mockError = new Error('Failed to retrieve events');
      mockReq.query = {};
      (getEvents as jest.Mock).mockRejectedValue(mockError);

      await eventController.getEvents(mockReq, mockRes);

      expect(getEvents).toHaveBeenCalled();
      expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
    });
  });

  describe('addEvent', () => {
    it('should create an event successfully', async () => {
      const mockEvent = { id: 1, title: 'event1' };
      mockReq.body = mockEvent;
      (addEvent as jest.Mock).mockResolvedValue(mockEvent);

      await eventController.addEvent(mockReq, mockRes);

      expect(addEvent).toHaveBeenCalledWith(mockEvent);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockEvent);
    });

    it('should handle errors when creating an event', async () => {
      const mockError = new Error('Failed to create event');
      mockReq.body = { title: 'event1' };
      (addEvent as jest.Mock).mockRejectedValue(mockError);

      await eventController.addEvent(mockReq, mockRes);

      expect(addEvent).toHaveBeenCalledWith({ title: 'event1' });
      expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
    });
  });

  describe('updateEvent', () => {
    it('should update an event successfully', async () => {
      const mockEvent = { id: 1, title: 'Updated Event' };
      mockReq.params = { id: '1' };
      mockReq.body = { title: 'Updated Event' };
      (updateEvent as jest.Mock).mockResolvedValue(mockEvent);

      await eventController.updateEvent(mockReq, mockRes);

      expect(updateEvent).toHaveBeenCalledWith(1, { title: 'Updated Event' });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockEvent);
    });

    it('should handle errors when updating an event', async () => {
      const mockError = new Error('Failed to update event');
      mockReq.params = { id: '1' };
      mockReq.body = { title: 'Updated Event' };
      (updateEvent as jest.Mock).mockRejectedValue(mockError);

      await eventController.updateEvent(mockReq, mockRes);

      expect(updateEvent).toHaveBeenCalledWith(1, { title: 'Updated Event' });
      expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event successfully', async () => {
      mockReq.params = { id: '1' };
      (deleteEvent as jest.Mock).mockResolvedValue(undefined);

      await eventController.deleteEvent(mockReq, mockRes);

      expect(deleteEvent).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should handle errors when deleting an event', async () => {
      const mockError = new Error('Failed to delete event');
      mockReq.params = { id: '1' };
      (deleteEvent as jest.Mock).mockRejectedValue(mockError);

      await eventController.deleteEvent(mockReq, mockRes);

      expect(deleteEvent).toHaveBeenCalledWith(1);
      expect(returnError).toHaveBeenCalledWith(mockRes, mockError);
    });
  });
});
