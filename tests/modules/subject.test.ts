// Import statements for Jest and the function to be tested
import { addSubject, getEvents, addEvent } from '../../src/modules/subject';
import subjectRepository from '../../src/modules/subject/repositories/subjectRepository';
import eventRepository from '../../src/modules/subject/repositories/eventRepository';

// Jest mock for subjectRepository
jest.mock('../../src/modules/subject/repositories/subjectRepository', () => ({
  addSubject: jest.fn(),
}));

describe('addSubject', () => {
  it('calls addSubject with the correct subject', async () => {
    // Arrange
    const mockSubject = { name: 'Mathematics' };
    (subjectRepository.addSubject as jest.Mock).mockResolvedValue(mockSubject);

    // Act
    const result = await addSubject(mockSubject);

    // Assert
    expect(subjectRepository.addSubject).toHaveBeenCalledWith(mockSubject);
    expect(result).toEqual(mockSubject);
  });
});

// Jest mock for eventRepository
jest.mock('../../src/modules/subject/repositories/eventRepository', () => ({
  getEvents: jest.fn(), addEvent: jest.fn(),
}));

describe('getEvents', () => {
  it('retrieves events successfully', async () => {
    // Arrange
    const mockEvents = [{ id: 1, name: 'Obligatorio 1' }, { id: 2, name: 'Parcial 1' }];
    (eventRepository.getEvents as jest.Mock).mockResolvedValue(mockEvents);

    // Act
    const result = await getEvents();

    // Assert
    expect(eventRepository.getEvents).toHaveBeenCalled();
    expect(result).toEqual(mockEvents);
  });
});

describe('addEvent', () => {
  it('adds an event successfully', async () => {
    // Arrange
    const mockEvent = { id: 1, title: 'New Event' };
    (eventRepository.addEvent as jest.Mock).mockResolvedValue(mockEvent);

    // Act
    const result = await addEvent(mockEvent);

    // Assert
    expect(eventRepository.addEvent).toHaveBeenCalledWith(mockEvent);
    expect(result).toEqual(mockEvent);
  });
});