import { addEvent, getEvents } from '../../src/modules/subject';
import eventRepository from '../../src/modules/subject/repositories/eventRepository';
import Event from '../../src/modules/subject/repositories/models/Event';
import {
  deleteEvent,
  getEventById,
  updateEvent,
} from '../../src/modules/subject/services/eventService';

jest.mock('../../src/modules/subject/repositories/eventRepository');

describe('Event Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addEvent', () => {
    it('should add an event successfully', async () => {
      const mockEvent = { id: 1, title: 'Test Event' } as Partial<Event>;
      (eventRepository.addEvent as jest.Mock).mockResolvedValue(mockEvent);

      const result = await addEvent(mockEvent);

      expect(eventRepository.addEvent).toHaveBeenCalledWith(mockEvent);
      expect(result).toEqual(mockEvent);
    });

    it('should throw an error if adding event fails', async () => {
      const mockError = new Error('Failed to add event');
      (eventRepository.addEvent as jest.Mock).mockRejectedValue(mockError);

      await expect(addEvent({ title: 'Test Event' })).rejects.toThrow(
        'Failed to add event'
      );
      expect(eventRepository.addEvent).toHaveBeenCalled();
    });
  });

  describe('getEvents', () => {
    it('should retrieve events with filters, sorting, and pagination', async () => {
      const mockEvents = [{ id: 1, title: 'Test Event' }];
      const mockParams = {
        filters: {},
        sortField: 'date',
        sortOrder: undefined,
        page: 1,
        pageSize: 10,
      };
      (eventRepository.getEvents as jest.Mock).mockResolvedValue(mockEvents);

      const result = await getEvents(
        mockParams.filters,
        mockParams.sortField,
        mockParams.sortOrder,
        mockParams.page,
        mockParams.pageSize
      );

      expect(eventRepository.getEvents).toHaveBeenCalledWith(
        mockParams.filters,
        mockParams.sortField,
        mockParams.sortOrder,
        mockParams.page,
        mockParams.pageSize
      );
      expect(result).toEqual(mockEvents);
    });

    it('should throw an error if retrieving events fails', async () => {
      const mockError = new Error('Failed to retrieve events');
      (eventRepository.getEvents as jest.Mock).mockRejectedValue(mockError);

      await expect(getEvents()).rejects.toThrow('Failed to retrieve events');
      expect(eventRepository.getEvents).toHaveBeenCalled();
    });
  });

  describe('getEventById', () => {
    it('should retrieve an event by ID successfully', async () => {
      const mockEvent = { id: 1, title: 'Test Event' };
      (eventRepository.getEventById as jest.Mock).mockResolvedValue(mockEvent);

      const result = await getEventById(1);

      expect(eventRepository.getEventById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEvent);
    });

    it('should throw an error if retrieving event by ID fails', async () => {
      const mockError = new Error('Event not found');
      (eventRepository.getEventById as jest.Mock).mockRejectedValue(mockError);

      await expect(getEventById(1)).rejects.toThrow('Event not found');
      expect(eventRepository.getEventById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateEvent', () => {
    it('should update an event successfully', async () => {
      const mockEvent = { id: 1, title: 'Updated Event' };
      (eventRepository.updateEvent as jest.Mock).mockResolvedValue(mockEvent);

      const result = await updateEvent(1, {
        title: 'Updated Event',
      });

      expect(eventRepository.updateEvent).toHaveBeenCalledWith(1, {
        title: 'Updated Event',
      });
      expect(result).toEqual(mockEvent);
    });

    it('should throw an error if updating event fails', async () => {
      const mockError = new Error('Failed to update event');
      (eventRepository.updateEvent as jest.Mock).mockRejectedValue(mockError);

      await expect(updateEvent(1, { title: 'Updated Event' })).rejects.toThrow(
        'Failed to update event'
      );
      expect(eventRepository.updateEvent).toHaveBeenCalledWith(1, {
        title: 'Updated Event',
      });
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event successfully', async () => {
      (eventRepository.deleteEvent as jest.Mock).mockResolvedValue(undefined);

      await deleteEvent(1);

      expect(eventRepository.deleteEvent).toHaveBeenCalledWith(1);
    });

    it('should throw an error if deleting event fails', async () => {
      const mockError = new Error('Failed to delete event');
      (eventRepository.deleteEvent as jest.Mock).mockRejectedValue(mockError);

      await expect(deleteEvent(1)).rejects.toThrow('Failed to delete event');
      expect(eventRepository.deleteEvent).toHaveBeenCalledWith(1);
    });
  });
});
