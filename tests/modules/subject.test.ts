// Import statements for Jest and the function to be tested
import { addSubject, getEvents, addEvent, SubjectRequestDto, getSubjects } from '../../src/modules/subject';
import subjectRepository from '../../src/modules/subject/repositories/subjectRepository';
import eventRepository from '../../src/modules/subject/repositories/eventRepository';
import {SubjectRequestDtoHelper} from '../../src/modules/subject/dtos/request/subjectRequestDto';
import { ResourceNotFound } from '../../src/shared/utils/exceptions/customExceptions';

// Jest mock for subjectRepository
jest.mock('../../src/modules/subject/repositories/subjectRepository', () => ({
  addSubject: jest.fn(), getSubjects: jest.fn(),
}));
jest.mock('../../src/modules/subject/dtos/request/subjectRequestDto')

// Jest mock for eventRepository
jest.mock('../../src/modules/subject/repositories/eventRepository', () => ({
  getEvents: jest.fn(), addEvent: jest.fn(),
}));

const removeUndefined = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
};

const removeUndefinedAndEmptyArrays = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => 
      value !== undefined && !(Array.isArray(value) && value.length === 0)
    )
  );
};

describe('addSubject', () => {
  const mockSubjectDto: SubjectRequestDto = {
    name: 'Mathematics',
    subject_code: 'MATH101',
    study_plan_year: 1,
    associated_teacher: 1,
    index: 1,
    frontal_hours: 30,
    valid: true,
    events: [{ event_id: 1, description: 'Introduction to Mathematics' }],
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
    expect(removeUndefinedAndEmptyArrays(result)).toEqual(mockSubject);
  });
});

describe('getSubjects', () => {
  it('retrieves subjects successfully', async () => {
    // Arrange
    const mockSubjects = [{ id: 1, name: 'Mathematics' }, { id: 2, name: 'Physics' }];
    (subjectRepository.getSubjects as jest.Mock).mockResolvedValue(mockSubjects);

    // Act
    const result = await getSubjects();

    // Assert
    expect(subjectRepository.getSubjects).toHaveBeenCalled();
    expect(result.map(removeUndefinedAndEmptyArrays)).toEqual(mockSubjects.map(removeUndefinedAndEmptyArrays));

  });

  it('retrieves subjects with filters successfully', async () => {
    // Arrange
    const filters = { name: 'Mathematics' };
    const mockFilteredSubjects = [{ id: 1, name: 'Mathematics' }];
    (subjectRepository.getSubjects as jest.Mock).mockResolvedValue(mockFilteredSubjects);

    // Act
    const result = await getSubjects(filters);

    // Assert
    expect(subjectRepository.getSubjects).toHaveBeenCalledWith(filters, undefined, undefined, undefined, undefined);
    expect(result.map(removeUndefinedAndEmptyArrays)).toEqual(mockFilteredSubjects.map(removeUndefinedAndEmptyArrays));
  });

  it('retrieves subjects with filters and pages successfully', async () => {
    // Arrange
    const filters = { name: 'Mathematics' };
    const sortField = 'name';
    const sortOrder = 'ASC';
    const page = 1;
    const pageSize = 10;
    const mockFilteredSubjects = [{ id: 1, name: 'Mathematics' }];
    (subjectRepository.getSubjects as jest.Mock).mockResolvedValue(mockFilteredSubjects);

    // Act
    const result = await getSubjects(filters, sortField, sortOrder, page, pageSize);

    // Assert
    expect(subjectRepository.getSubjects).toHaveBeenCalledWith(filters, sortField, sortOrder, page, pageSize);
    expect(result.map(removeUndefinedAndEmptyArrays)).toEqual(mockFilteredSubjects.map(removeUndefinedAndEmptyArrays));
  });
})

describe('getEvents', () => {
  it('retrieves events successfully', async () => {
    // Arrange
    const mockEvents = [{ id: 1, title: 'Obligatorio 1' }, { id: 2, title: 'Parcial 1' }];
    (eventRepository.getEvents as jest.Mock).mockResolvedValue(mockEvents);

    // Act
    const result = await getEvents();

    // Assert
    expect(eventRepository.getEvents).toHaveBeenCalled();
    expect(result.map(removeUndefinedAndEmptyArrays)).toEqual(mockEvents.map(removeUndefinedAndEmptyArrays));
  });

  it('retrieves events with filters successfully', async () => {
    // Arrange
    const filters = { title: 'Obligatorio' };
    const mockFilteredEvents = [{ id: 1, title: 'Obligatorio 1' }];
    (eventRepository.getEvents as jest.Mock).mockResolvedValue(mockFilteredEvents);

    // Act
    const result = await getEvents(filters);

    // Assert
    expect(eventRepository.getEvents).toHaveBeenCalledWith(filters, undefined, undefined, undefined, undefined);
    expect(result).toEqual(mockFilteredEvents);
  });

  it('retrieves events with filters and pages successfully', async () => {
    // Arrange
    const filters = { title: 'Obligatorio'}
    const sortField = 'title';
    const sortOrder = 'ASC';
    const page = 1; 
    const pageSize = 10;
    const mockFilteredEvents = [{ id: 1, title: 'Obligatorio 1' }];
    (eventRepository.getEvents as jest.Mock).mockResolvedValue(mockFilteredEvents);

    // Act
    const result = await getEvents(filters, sortField, sortOrder, page, pageSize);

    // Assert
    expect(eventRepository.getEvents).toHaveBeenCalledWith(filters, sortField, sortOrder, page, pageSize);
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