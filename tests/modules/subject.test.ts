// Import statements for Jest and the function to be tested
import { addSubject, getEvents, addEvent, SubjectRequestDto, SubjectEventRequestDto } from '../../src/modules/subject';
import subjectRepository from '../../src/modules/subject/repositories/subjectRepository';
import eventRepository from '../../src/modules/subject/repositories/eventRepository';
import {SubjectRequestDtoHelper} from '../../src/modules/subject/dtos/request/subjectRequestDto';
import { ResourceNotFound } from '../../src/shared/utils/exceptions/customExceptions';

// Jest mock for subjectRepository
jest.mock('../../src/modules/subject/repositories/subjectRepository', () => ({
  addSubject: jest.fn()
}));
jest.mock('../../src/modules/subject/dtos/request/subjectRequestDto')

// Jest mock for eventRepository
jest.mock('../../src/modules/subject/repositories/eventRepository', () => ({
  getEvents: jest.fn(), addEvent: jest.fn(),
}));

describe('addSubject', () => {
  const mockSubjectDto: SubjectRequestDto = {
    name: 'Mathematics',
    subject_code: 'MATH101',
    study_plan_year: 1,
    associated_teacher: 1,
    index: 1,
    frontal_hours: 30,
    valid: true,
    events: [{ eventId: 1, description: 'Introduction to Mathematics' }],
  };

  const mockSubject = {
    id: 1,
    ...mockSubjectDto,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds a subject successfully with events', async () => {
    // Arrange
    (SubjectRequestDtoHelper.toModel as jest.Mock).mockReturnValue(mockSubject);
    (subjectRepository.addSubject as jest.Mock).mockResolvedValue(mockSubject);

    // Act
    const result = await addSubject(mockSubjectDto);

    // Assert
    expect(SubjectRequestDtoHelper.toModel).toHaveBeenCalledWith(mockSubjectDto);
    expect(subjectRepository.addSubject).toHaveBeenCalledWith(mockSubject);
    expect(result).toEqual(mockSubject);
  });

  /*it('throws an error if event does not exist', async () => {
    // Arrange
    (SubjectRequestDtoHelper.toModel as jest.Mock).mockReturnValue(mockSubject);
    (subjectRepository.addSubject as jest.Mock).mockResolvedValue(mockSubject);

    // Act & Assert
    await expect(addSubject(mockSubjectDto)).rejects.toThrow(ResourceNotFound);
    expect(SubjectRequestDtoHelper.toModel).toHaveBeenCalledWith(mockSubjectDto);
    expect(subjectRepository.addSubject).toHaveBeenCalledWith(mockSubject);
  });*/
});

describe('getEvents', () => {
  it('retrieves events successfully', async () => {
    // Arrange
    const mockEvents = [{ id: 1, title: 'Obligatorio 1' }, { id: 2, title: 'Parcial 1' }];
    (eventRepository.getEvents as jest.Mock).mockResolvedValue(mockEvents);

    // Act
    const result = await getEvents();

    // Assert
    expect(eventRepository.getEvents).toHaveBeenCalled();
    expect(result).toEqual(mockEvents);
  });

  it('retrieves events with filters successfully', async () => {
    // Arrange
    const filters = { title: 'Obligatorio' };
    const mockFilteredEvents = [{ id: 1, title: 'Obligatorio 1' }];
    (eventRepository.getEvents as jest.Mock).mockResolvedValue(mockFilteredEvents);

    // Act
    const result = await getEvents(filters);

    // Assert
    expect(eventRepository.getEvents).toHaveBeenCalledWith(filters);
    expect(result).toEqual(mockFilteredEvents);
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