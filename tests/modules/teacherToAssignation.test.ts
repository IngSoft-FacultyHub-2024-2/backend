import { getAssignationsConflicts } from '../../src/modules/assignTeachersToLectures';
import {
  getSemesterLectures,
  getSemesterLecturesToAssign,
} from '../../src/modules/semester';
import { getTeachersToAssignLectures } from '../../src/modules/teacher';

// Mock the dependency functions
jest.mock('../../src/modules/semester', () => ({
  getSemesterLectures: jest.fn(),
  getSemesterLecturesToAssign: jest.fn(),
}));
jest.mock('../../src/modules/teacher', () => ({
  getTeachersToAssignLectures: jest.fn(),
}));

describe('getAssignationsConflicts', () => {
  const mockSemesterId = 1;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  it('should return unassigned teachers and unassigned lecture roles', async () => {
    // Sample data for mocks
    const teachersToAssign = [
      {
        id: 1,
        name: 'Teacher A',
      },
      {
        id: 2,
        name: 'Teacher B',
      },
    ];

    const semesterLectures = [
      {
        id: 1,
        lecture_roles: [
          {
            id: 1,
            role: 'Teórico',
            teachers: [{ id: 1, name: 'Teacher A' }],
          },
        ],
      },
    ];

    const lecturesToAssign = [
      {
        id: 1,
        subClasses: [{ role: 'Teórico', num_teachers: 2 }],
      },
    ];

    // Mock the behavior of dependency functions
    (getTeachersToAssignLectures as jest.Mock).mockResolvedValue(
      teachersToAssign
    );
    (getSemesterLectures as jest.Mock).mockResolvedValue(semesterLectures);
    (getSemesterLecturesToAssign as jest.Mock).mockResolvedValue(
      lecturesToAssign
    );

    // Call the function
    const result = await getAssignationsConflicts(mockSemesterId);

    // Assertions
    expect(result).toEqual({
      unassignedTeachers: [{ id: 2, name: 'Teacher B' }],
      unassignedLecturesRolesIds: [1], // Lecture role not fully assigned
    });

    expect(getTeachersToAssignLectures).toHaveBeenCalledTimes(1);
    expect(getSemesterLectures).toHaveBeenCalledWith(mockSemesterId);
    expect(getSemesterLecturesToAssign).toHaveBeenCalledWith(mockSemesterId);
  });

  it('should handle cases with no unassigned teachers or lecture roles', async () => {
    // Mock data with everything assigned
    const teachersToAssign = [{ id: 1, name: 'Teacher A' }];

    const semesterLectures = [
      {
        id: 1,
        lecture_roles: [
          {
            id: 1,
            role: 'Teórico',
            teachers: [{ id: 1, name: 'Teacher A' }],
          },
        ],
      },
    ];

    const lecturesToAssign = [
      {
        id: 1,
        subClasses: [{ role: 'Teórico', num_teachers: 1 }],
      },
    ];

    // Mock the behavior of dependency functions
    (getTeachersToAssignLectures as jest.Mock).mockResolvedValue(
      teachersToAssign
    );
    (getSemesterLectures as jest.Mock).mockResolvedValue(semesterLectures);
    (getSemesterLecturesToAssign as jest.Mock).mockResolvedValue(
      lecturesToAssign
    );

    // Call the function
    const result = await getAssignationsConflicts(mockSemesterId);

    // Assertions
    expect(result).toEqual({
      unassignedTeachers: [],
      unassignedLecturesRolesIds: [],
    });

    expect(getTeachersToAssignLectures).toHaveBeenCalledTimes(1);
    expect(getSemesterLectures).toHaveBeenCalledWith(mockSemesterId);
    expect(getSemesterLecturesToAssign).toHaveBeenCalledWith(mockSemesterId);
  });

  it('should throw an error if a dependency fails', async () => {
    // Mock a failing dependency
    (getTeachersToAssignLectures as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch teachers')
    );

    // Call the function and expect it to throw
    await expect(getAssignationsConflicts(mockSemesterId)).rejects.toThrow(
      'Failed to fetch teachers'
    );

    expect(getTeachersToAssignLectures).toHaveBeenCalledTimes(1);
    expect(getSemesterLectures).not.toHaveBeenCalled();
    expect(getSemesterLecturesToAssign).not.toHaveBeenCalled();
  });
});
