// Import statements for Jest and the function to be tested
import {
  addEvent,
  addSubject,
  getAllSubjectNames,
  getEvents,
  getSubjectById,
  getSubjects,
  SubjectRequestDto,
  updateSubject,
  updateSubjectVigencyByStudyPlan,
} from '../../src/modules/subject';
import { SubjectRequestDtoHelper } from '../../src/modules/subject/dtos/request/subjectRequestDto';
import eventRepository from '../../src/modules/subject/repositories/eventRepository';
import subjectRepository from '../../src/modules/subject/repositories/subjectRepository';
import { getTeacherById } from '../../src/modules/teacher';
import { ResourceNotFound } from '../../src/shared/utils/exceptions/customExceptions';

// Jest mock for subjectRepository
jest.mock('../../src/modules/subject/repositories/subjectRepository', () => ({
  addSubject: jest.fn(),
  getSubjects: jest.fn(),
  getAllSubjectNames: jest.fn(),
  getSubjectById: jest.fn(),
  updateSubject: jest.fn(),
  updateSubjectVigencyByStudyPlan: jest.fn(),
}));
jest.mock('../../src/modules/subject/dtos/request/subjectRequestDto');
jest.mock('../../src/modules/teacher/', () => ({
  getTeacherById: jest.fn(),
}));

// Jest mock for eventRepository
jest.mock('../../src/modules/subject/repositories/eventRepository', () => ({
  getEvents: jest.fn(),
  addEvent: jest.fn(),
}));

const removeUndefinedAndEmptyArrays = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter(
        (value) =>
          value !== undefined && !(Array.isArray(value) && value.length === 0)
      )
      .map(removeUndefinedAndEmptyArrays);
  }
  return Object.fromEntries(
    Object.entries(obj)
      .filter(
        ([_, value]) =>
          value !== undefined && !(Array.isArray(value) && value.length === 0)
      )
      .map(([key, value]) => [key, removeUndefinedAndEmptyArrays(value)])
  );
};

describe('addSubject', () => {
  const mockSubjectDto: SubjectRequestDto = {
    name: 'Mathematics',
    subject_code: 'MATH101',
    associated_coordinator: 1,
    acronym: 'MATH',
    study_plan_id: 1,
    index: 1,
    needs_notes: '',
    frontal_hours: 30,
    valid: true,
    events: [{ event_id: 1, description: 'Introduction to Mathematics' }],
  };

  const mockSubject = {
    id: 1,
    ...mockSubjectDto,
  };

  const mockCoordinator = { id: 1, name: 'Dr. Smith' };

  const mockSubjectResponseDto = {
    id: 1,
    ...mockSubjectDto,
    associated_coordinator: mockCoordinator,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds a subject successfully with events', async () => {
    // Arrange
    (SubjectRequestDtoHelper.toModel as jest.Mock).mockReturnValue(mockSubject);
    (subjectRepository.addSubject as jest.Mock).mockResolvedValue(mockSubject);
    (getTeacherById as jest.Mock).mockResolvedValue(mockCoordinator);

    // Act
    const result = await addSubject(mockSubjectDto);

    // Assert
    expect(SubjectRequestDtoHelper.toModel).toHaveBeenCalledWith(
      mockSubjectDto
    );
    expect(subjectRepository.addSubject).toHaveBeenCalledWith(mockSubject);
    expect(getTeacherById).toHaveBeenCalledWith(
      mockSubjectDto.associated_coordinator
    );
    expect(removeUndefinedAndEmptyArrays(result)).toEqual(
      mockSubjectResponseDto
    );
  });
});

describe('getSubjects', () => {
  it('retrieves subjects successfully', async () => {
    // Arrange
    const mockSubjects = [
      { id: 1, name: 'Mathematics', associated_coordinator: 1 },
      { id: 2, name: 'Physics', associated_coordinator: 2 },
    ];
    const mockCoordinators = [
      { id: 1, name: 'Dr. Smith' },
      { id: 2, name: 'Dr. Brown' },
    ];
    const mockSubjectResponseDtos = [
      {
        id: 1,
        name: 'Mathematics',
        associated_coordinator: mockCoordinators[0],
      },
      { id: 2, name: 'Physics', associated_coordinator: mockCoordinators[1] },
    ];
    (subjectRepository.getSubjects as jest.Mock).mockResolvedValue({
      rows: mockSubjects,
      count: 2,
    });
    (getTeacherById as jest.Mock).mockImplementation(async (id: number) =>
      mockCoordinators.find((c) => c.id === id)
    );

    // Act
    const result = await getSubjects();

    // Assert
    expect(subjectRepository.getSubjects).toHaveBeenCalled();
    expect(getTeacherById).toHaveBeenCalledWith(1);
    expect(getTeacherById).toHaveBeenCalledWith(2);
    expect(result.subjects?.map(removeUndefinedAndEmptyArrays)).toEqual(
      mockSubjectResponseDtos
    );
    expect(result.totalPages).toEqual(1); // Based on count and pageSize
    expect(result.currentPage).toEqual(1);
  });

  it('retrieves subjects with search successfully', async () => {
    // Arrange
    const search = 'Mathematics';
    const mockFilteredSubjects = {
      rows: [{ id: 1, name: 'Mathematics', associated_coordinator: 1 }],
      count: 1,
    };
    const mockCoordinator = { id: 1, name: 'Dr. Smith' };
    const mockFilteredSubjectDto = {
      id: 1,
      name: 'Mathematics',
      associated_coordinator: mockCoordinator,
    };
    (subjectRepository.getSubjects as jest.Mock).mockResolvedValue(
      mockFilteredSubjects
    );
    (getTeacherById as jest.Mock).mockResolvedValue(mockCoordinator);

    // Act
    const result = await getSubjects({}, search);

    // Assert
    expect(subjectRepository.getSubjects).toHaveBeenCalledWith(
      10,
      0,
      undefined,
      undefined,
      search,
      {},
      undefined
    );
    expect(result.subjects.map(removeUndefinedAndEmptyArrays)).toEqual(
      [mockFilteredSubjectDto].map(removeUndefinedAndEmptyArrays)
    );
    expect(result.totalPages).toEqual(1); // Based on count and pageSize
    expect(result.currentPage).toEqual(1);
  });

  it('retrieves subjects with search and pages successfully', async () => {
    // Arrange
    const filters = {};
    const search = 'Mathematics';
    const sortField = 'name';
    const sortOrder = 'ASC';
    const page = 1;
    const pageSize = 10;
    const mockFilteredSubjects = {
      rows: [{ id: 1, name: 'Mathematics', associated_coordinator: 1 }],
      count: 1,
    };
    const mockCoordinator = { id: 1, name: 'Dr. Smith' };
    const mockFilteredSubjectDto = {
      id: 1,
      name: 'Mathematics',
      associated_coordinator: mockCoordinator,
    };
    (subjectRepository.getSubjects as jest.Mock).mockResolvedValue(
      mockFilteredSubjects
    );
    (getTeacherById as jest.Mock).mockResolvedValue(mockCoordinator);

    // Act
    const result = await getSubjects(
      filters,
      search,
      sortField,
      sortOrder,
      page,
      pageSize
    );

    // Assert
    expect(subjectRepository.getSubjects).toHaveBeenCalledWith(
      pageSize,
      (page - 1) * pageSize,
      sortOrder,
      undefined,
      search,
      filters,
      sortField
    );
    expect(result.subjects.map(removeUndefinedAndEmptyArrays)).toEqual(
      [mockFilteredSubjectDto].map(removeUndefinedAndEmptyArrays)
    );
    expect(result.totalPages).toEqual(1); // Based on count and pageSize
    expect(result.currentPage).toEqual(page);
  });
});

describe('getSubjectById', () => {
  const mockSubject = { id: 1, name: 'Math', associated_coordinator: 1 };
  const mockCoordinator = { id: 1, name: 'Dr. Smith' };
  const mockSubjectResponseDto = {
    id: 1,
    name: 'Math',
    associated_coordinator: mockCoordinator,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return subject, not include coordinators', async () => {
    (subjectRepository.getSubjectById as jest.Mock).mockResolvedValue(
      mockSubject
    );

    const result = await getSubjectById(1);

    expect(subjectRepository.getSubjectById).toHaveBeenCalledWith(1);
    expect(removeUndefinedAndEmptyArrays(result)).toEqual({
      ...mockSubject,
      associated_coordinator: null,
    });
  });

  it('should return subject DTO with coordinator info if includeOtherInfo is true', async () => {
    // Arrange
    (subjectRepository.getSubjectById as jest.Mock).mockResolvedValue(
      mockSubject
    );
    (getTeacherById as jest.Mock).mockResolvedValue(mockCoordinator);

    // Act
    const result = await getSubjectById(1, true);

    // Assert
    expect(subjectRepository.getSubjectById).toHaveBeenCalledWith(1);
    expect(getTeacherById).toHaveBeenCalledWith(
      mockSubject.associated_coordinator
    );
    expect(removeUndefinedAndEmptyArrays(result)).toEqual(
      mockSubjectResponseDto
    );
  });

  it('should throw ResourceNotFound exception if subject does not exist', async () => {
    // Arrange
    (subjectRepository.getSubjectById as jest.Mock).mockResolvedValue(null);

    // Act & Assert
    await expect(getSubjectById(999)).rejects.toThrow(ResourceNotFound);
    expect(subjectRepository.getSubjectById).toHaveBeenCalledWith(999);
  });
});

describe('getAllSubjectNames', () => {
  it('should return all subjects names', async () => {
    const subjects = [
      {
        id: 1,
        name: 'Diseño1',
        acronym: 'DA1',
        valid: true,
        study_plan_year: 2024,
      },
      {
        id: 2,
        name: 'Diseño2',
        acronym: 'DA2',
        valid: true,
        study_plan_year: 2024,
      },
    ];
    (subjectRepository.getAllSubjectNames as jest.Mock).mockResolvedValue(
      subjects
    );

    const result = await getAllSubjectNames();

    expect(result).toEqual(subjects);
    expect(subjectRepository.getAllSubjectNames).toHaveBeenCalled();
  });
});

describe('updateSubject', () => {
  const mockSubjectDtoToUpdate: SubjectRequestDto = {
    id: 1,
    name: 'Mathematics',
    subject_code: 'MATH101',
    associated_coordinator: 1,
    acronym: 'MATH',
    study_plan_id: 1,
    index: 1,
    needs_notes: '',
    frontal_hours: 30,
    valid: true,
    events: [{ event_id: 1, description: 'Introduction to Mathematics' }],
  };

  const coordinator = { id: 1, name: 'John Doe' };

  beforeEach(() => {
    (subjectRepository.updateSubject as jest.Mock).mockResolvedValue(
      mockSubjectDtoToUpdate
    );
    (getTeacherById as jest.Mock).mockResolvedValue(coordinator);
  });

  it('should update the subject and return the correct response', async () => {
    const result = await updateSubject(1, mockSubjectDtoToUpdate);

    expect(SubjectRequestDtoHelper.toModel).toHaveBeenCalledWith(
      mockSubjectDtoToUpdate
    );
    expect(subjectRepository.updateSubject).toHaveBeenCalledWith(
      1,
      mockSubjectDtoToUpdate
    );
    expect(getTeacherById).toHaveBeenCalledWith(
      mockSubjectDtoToUpdate.associated_coordinator
    );
    expect(removeUndefinedAndEmptyArrays(result)).toEqual({
      ...mockSubjectDtoToUpdate,
      associated_coordinator: coordinator,
    });
  });
});

describe('getEvents', () => {
  it('retrieves events successfully', async () => {
    // Arrange
    const mockEvents = [
      { id: 1, title: 'Obligatorio 1' },
      { id: 2, title: 'Parcial 1' },
    ];
    (eventRepository.getEvents as jest.Mock).mockResolvedValue(mockEvents);

    // Act
    const result = await getEvents();

    // Assert
    expect(eventRepository.getEvents).toHaveBeenCalled();
    expect(result.map(removeUndefinedAndEmptyArrays)).toEqual(
      mockEvents.map(removeUndefinedAndEmptyArrays)
    );
  });

  it('retrieves events with filters successfully', async () => {
    // Arrange
    const filters = { title: 'Obligatorio' };
    const mockFilteredEvents = [{ id: 1, title: 'Obligatorio 1' }];
    (eventRepository.getEvents as jest.Mock).mockResolvedValue(
      mockFilteredEvents
    );

    // Act
    const result = await getEvents(filters);

    // Assert
    expect(eventRepository.getEvents).toHaveBeenCalledWith(
      filters,
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(result).toEqual(mockFilteredEvents);
  });

  it('retrieves events with filters and pages successfully', async () => {
    // Arrange
    const filters = { title: 'Obligatorio' };
    const sortField = 'title';
    const sortOrder = 'ASC';
    const page = 1;
    const pageSize = 10;
    const mockFilteredEvents = [{ id: 1, title: 'Obligatorio 1' }];
    (eventRepository.getEvents as jest.Mock).mockResolvedValue(
      mockFilteredEvents
    );

    // Act
    const result = await getEvents(
      filters,
      sortField,
      sortOrder,
      page,
      pageSize
    );

    // Assert
    expect(eventRepository.getEvents).toHaveBeenCalledWith(
      filters,
      sortField,
      sortOrder,
      page,
      pageSize
    );
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

describe('updateSubjectVigencyByStudyPlan', () => {
  const studyPlanId = 1;
  const vigency = true;

  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar mocks antes de cada test
  });

  it('debe llamar a subjectRepository.updateSubjectVigencyByStudyPlan con los argumentos correctos', async () => {
    await updateSubjectVigencyByStudyPlan(studyPlanId, vigency);

    expect(
      subjectRepository.updateSubjectVigencyByStudyPlan
    ).toHaveBeenCalledTimes(1);
    expect(
      subjectRepository.updateSubjectVigencyByStudyPlan
    ).toHaveBeenCalledWith(studyPlanId, vigency);
  });

  it('debe lanzar un error si subjectRepository.updateSubjectVigencyByStudyPlan falla', async () => {
    (
      subjectRepository.updateSubjectVigencyByStudyPlan as jest.Mock
    ).mockRejectedValue(new Error('Database error'));

    await expect(
      updateSubjectVigencyByStudyPlan(studyPlanId, vigency)
    ).rejects.toThrow('Database error');
  });
});
