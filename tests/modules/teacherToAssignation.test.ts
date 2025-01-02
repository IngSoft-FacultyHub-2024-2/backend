import { getAssignationsConflicts } from '../../src/modules/assignTeachersToLectures';
import {
  getSemesterLectures,
  getSemesterLecturesToAssign,
} from '../../src/modules/semester';
import {
  getTeachersToAssignLectures,
  getTeacherById,
} from '../../src/modules/teacher';

// Mock the dependency functions
jest.mock('../../src/modules/semester', () => ({
  getSemesterLectures: jest.fn(),
  getSemesterLecturesToAssign: jest.fn(),
}));
jest.mock('../../src/modules/teacher', () => ({
  getTeachersToAssignLectures: jest.fn(),
  getTeacherById: jest.fn(),
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
        subjects_history: [{ subject_id: 1, role: 'Teórico' }],
        teacher_available_modules: [
          {
            id: 3,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 2,
          },
          {
            id: 4,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 1,
          },
        ],
      },
      {
        id: 2,
        name: 'Teacher B',
        subjects_history: [{ subject_id: 1, role: 'Teórico' }],
        teacher_available_modules: [
          {
            id: 3,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 2,
          },
          {
            id: 4,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 1,
          },
        ],
      },
    ];

    const semesterLectures = [
      {
        id: 1,
        subject: { id: 1 },
        lecture_roles: [
          {
            id: 1,
            role: 'Teórico',
            teachers: [{ id: 1, name: 'Teacher A' }],
            hour_configs: [
              {
                id: 15,
                day_of_week: 'Lunes',
                modules: [1, 2],
              },
            ],
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
    (getTeacherById as jest.Mock).mockImplementation((id) =>
      teachersToAssign.find((t) => t.id === id)
    );

    // Call the function
    const result = await getAssignationsConflicts(mockSemesterId);

    // Assertions
    expect(result).toEqual({
      teacherTeaching2LectureAtSameTime: [],
      teachersBusyAtLectureTime: [],
      teachersDoNotKnowSubject: [],
      unassignedTeachers: [teachersToAssign[1]],
      unassignedLecturesRolesIds: [1], // Lecture role not fully assigned
    });

    expect(getTeachersToAssignLectures).toHaveBeenCalledTimes(1);
    expect(getSemesterLectures).toHaveBeenCalledWith(mockSemesterId);
    expect(getSemesterLecturesToAssign).toHaveBeenCalledWith(mockSemesterId);
  });

  it('should handle cases with no unassigned teachers or lecture roles', async () => {
    // Mock data with everything assigned
    const teachersToAssign = [
      {
        id: 1,
        name: 'Teacher A',
        subjects_history: [{ subject_id: 1, role: 'Teórico' }],
        teacher_available_modules: [
          {
            id: 3,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 2,
          },
          {
            id: 4,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 1,
          },
        ],
      },
    ];
    const semesterLectures = [
      {
        id: 1,
        subject: { id: 1 },
        lecture_roles: [
          {
            id: 1,
            role: 'Teórico',
            teachers: [{ id: 1, name: 'Teacher A' }],
            hour_configs: [
              {
                id: 15,
                day_of_week: 'Lunes',
                modules: [1, 2],
              },
            ],
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
    (getTeacherById as jest.Mock).mockImplementation((id) =>
      teachersToAssign.find((t) => t.id === id)
    );

    // Call the function
    const result = await getAssignationsConflicts(mockSemesterId);

    // Assertions
    expect(result).toEqual({
      teacherTeaching2LectureAtSameTime: [],
      teachersBusyAtLectureTime: [],
      teachersDoNotKnowSubject: [],
      unassignedTeachers: [],
      unassignedLecturesRolesIds: [],
    });

    expect(getTeachersToAssignLectures).toHaveBeenCalledTimes(1);
    expect(getSemesterLectures).toHaveBeenCalledWith(mockSemesterId);
    expect(getSemesterLecturesToAssign).toHaveBeenCalledWith(mockSemesterId);
  });

  it('should return a teachers that do not know the subject', async () => {
    // Sample data for mocks
    const teachersToAssign = [
      {
        id: 1,
        name: 'Teacher A',
        subjects_history: [{ subject_id: 2, role: 'Teórico' }],
        teacher_available_modules: [
          {
            id: 3,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 2,
          },
          {
            id: 4,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 1,
          },
        ],
      },
    ];

    const semesterLectures = [
      {
        id: 1,
        subject: { id: 1 },
        lecture_roles: [
          {
            id: 1,
            role: 'Teórico',
            teachers: [{ id: 1, name: 'Teacher A' }],
            hour_configs: [
              {
                id: 15,
                day_of_week: 'Lunes',
                modules: [1, 2],
              },
            ],
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
    (getTeacherById as jest.Mock).mockImplementation((id) =>
      teachersToAssign.find((t) => t.id === id)
    );

    // Call the function
    const result = await getAssignationsConflicts(mockSemesterId);

    // Assertions
    expect(result).toEqual({
      teacherTeaching2LectureAtSameTime: [],
      teachersBusyAtLectureTime: [],
      teachersDoNotKnowSubject: [
        teachersToAssign[0],
        { id: 1 },
        semesterLectures[0].lecture_roles[0],
      ],
      unassignedTeachers: [],
      unassignedLecturesRolesIds: [], // Lecture role not fully assigned
    });

    expect(getTeachersToAssignLectures).toHaveBeenCalledTimes(1);
    expect(getSemesterLectures).toHaveBeenCalledWith(mockSemesterId);
    expect(getSemesterLecturesToAssign).toHaveBeenCalledWith(mockSemesterId);
  });

  it('should return a teachers that do not know the subject because of role', async () => {
    // Sample data for mocks
    const teachersToAssign = [
      {
        id: 1,
        name: 'Teacher A',
        subjects_history: [{ subject_id: 1, role: 'tecnologia' }],
        teacher_available_modules: [
          {
            id: 3,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 2,
          },
          {
            id: 4,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 1,
          },
        ],
      },
    ];

    const semesterLectures = [
      {
        id: 1,
        subject: { id: 1 },
        lecture_roles: [
          {
            id: 1,
            role: 'Teórico',
            teachers: [{ id: 1, name: 'Teacher A' }],
            hour_configs: [
              {
                id: 15,
                day_of_week: 'Lunes',
                modules: [1, 2],
              },
            ],
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
    (getTeacherById as jest.Mock).mockImplementation((id) =>
      teachersToAssign.find((t) => t.id === id)
    );

    // Call the function
    const result = await getAssignationsConflicts(mockSemesterId);

    // Assertions
    expect(result).toEqual({
      teacherTeaching2LectureAtSameTime: [],
      teachersBusyAtLectureTime: [],
      teachersDoNotKnowSubject: [
        teachersToAssign[0],
        { id: 1 },
        semesterLectures[0].lecture_roles[0],
      ],
      unassignedTeachers: [],
      unassignedLecturesRolesIds: [], // Lecture role not fully assigned
    });

    expect(getTeachersToAssignLectures).toHaveBeenCalledTimes(1);
    expect(getSemesterLectures).toHaveBeenCalledWith(mockSemesterId);
    expect(getSemesterLecturesToAssign).toHaveBeenCalledWith(mockSemesterId);
  });

  it('Teacher is not available at lecture time because of the day', async () => {
    // Sample data for mocks
    const teachersToAssign = [
      {
        id: 1,
        name: 'Teacher A',
        subjects_history: [{ subject_id: 1, role: 'Teórico' }],
        teacher_available_modules: [
          {
            id: 3,
            teacher_id: 1,
            day_of_week: 'Martes',
            module_id: 2,
          },
          {
            id: 4,
            teacher_id: 1,
            day_of_week: 'Martes',
            module_id: 1,
          },
        ],
      },
    ];

    const semesterLectures = [
      {
        id: 1,
        subject: { id: 1 },
        lecture_roles: [
          {
            id: 1,
            role: 'Teórico',
            teachers: [{ id: 1, name: 'Teacher A' }],
            hour_configs: [
              {
                id: 15,
                day_of_week: 'Lunes',
                modules: [1, 2],
              },
            ],
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
    (getTeacherById as jest.Mock).mockImplementation((id) =>
      teachersToAssign.find((t) => t.id === id)
    );

    // Call the function
    const result = await getAssignationsConflicts(mockSemesterId);

    // Assertions
    expect(result).toEqual({
      teacherTeaching2LectureAtSameTime: [],
      teachersBusyAtLectureTime: [
        teachersToAssign[0],
        semesterLectures[0].lecture_roles[0],
      ],
      teachersDoNotKnowSubject: [],
      unassignedTeachers: [],
      unassignedLecturesRolesIds: [], // Lecture role not fully assigned
    });

    expect(getTeachersToAssignLectures).toHaveBeenCalledTimes(1);
    expect(getSemesterLectures).toHaveBeenCalledWith(mockSemesterId);
    expect(getSemesterLecturesToAssign).toHaveBeenCalledWith(mockSemesterId);
  });

  it('Teacher is not available at lecture time because of the module time', async () => {
    // Sample data for mocks
    const teachersToAssign = [
      {
        id: 1,
        name: 'Teacher A',
        subjects_history: [{ subject_id: 1, role: 'Teórico' }],
        teacher_available_modules: [
          {
            id: 3,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 2,
          },
          {
            id: 4,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 3,
          },
        ],
      },
    ];

    const semesterLectures = [
      {
        id: 1,
        subject: { id: 1 },
        lecture_roles: [
          {
            id: 1,
            role: 'Teórico',
            teachers: [{ id: 1, name: 'Teacher A' }],
            hour_configs: [
              {
                id: 15,
                day_of_week: 'Lunes',
                modules: [1, 2],
              },
            ],
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
    (getTeacherById as jest.Mock).mockImplementation((id) =>
      teachersToAssign.find((t) => t.id === id)
    );

    // Call the function
    const result = await getAssignationsConflicts(mockSemesterId);

    // Assertions
    expect(result).toEqual({
      teacherTeaching2LectureAtSameTime: [],
      teachersBusyAtLectureTime: [
        teachersToAssign[0],
        semesterLectures[0].lecture_roles[0],
      ],
      teachersDoNotKnowSubject: [],
      unassignedTeachers: [],
      unassignedLecturesRolesIds: [], // Lecture role not fully assigned
    });

    expect(getTeachersToAssignLectures).toHaveBeenCalledTimes(1);
    expect(getSemesterLectures).toHaveBeenCalledWith(mockSemesterId);
    expect(getSemesterLecturesToAssign).toHaveBeenCalledWith(mockSemesterId);
  });

  it('Teacher gives 2 classes at the same time', async () => {
    // Sample data for mocks
    const teachersToAssign = [
      {
        id: 1,
        name: 'Teacher A',
        subjects_history: [{ subject_id: 1, role: 'Teórico' }],
        teacher_available_modules: [
          {
            id: 3,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 1,
          },
          {
            id: 4,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 2,
          },
        ],
      },
    ];

    const semesterLectures = [
      {
        id: 1,
        subject: { id: 1 },
        lecture_roles: [
          {
            id: 1,
            role: 'Teórico',
            teachers: [{ id: 1, name: 'Teacher A' }],
            hour_configs: [
              {
                id: 15,
                day_of_week: 'Lunes',
                modules: [1, 2],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        subject: { id: 1 },
        lecture_roles: [
          {
            id: 2,
            role: 'Teórico',
            teachers: [{ id: 1, name: 'Teacher A' }],
            hour_configs: [
              {
                id: 15,
                day_of_week: 'Lunes',
                modules: [1, 2],
              },
            ],
          },
        ],
      },
    ];

    const lecturesToAssign = [
      {
        id: 1,
        subClasses: [{ role: 'Teórico', num_teachers: 1 }],
      },
      {
        id: 2,
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
    (getTeacherById as jest.Mock).mockImplementation((id) =>
      teachersToAssign.find((t) => t.id === id)
    );

    // Call the function
    const result = await getAssignationsConflicts(mockSemesterId);

    // Assertions
    expect(result).toEqual({
      teacherTeaching2LectureAtSameTime: [
        {
          teacherId: 1,
          conflictingLectures: [semesterLectures[1]],
        },
      ],
      teachersBusyAtLectureTime: [],
      teachersDoNotKnowSubject: [],
      unassignedTeachers: [],
      unassignedLecturesRolesIds: [], // Lecture role not fully assigned
    });

    expect(getTeachersToAssignLectures).toHaveBeenCalledTimes(1);
    expect(getSemesterLectures).toHaveBeenCalledWith(mockSemesterId);
    expect(getSemesterLecturesToAssign).toHaveBeenCalledWith(mockSemesterId);
  });

  it('Two teacher gives 2 classes at the same time, no conflict', async () => {
    // Sample data for mocks
    const teachersToAssign = [
      {
        id: 1,
        name: 'Teacher A',
        subjects_history: [{ subject_id: 1, role: 'Teórico' }],
        teacher_available_modules: [
          {
            id: 3,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 1,
          },
          {
            id: 4,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 2,
          },
        ],
      },
      {
        id: 2,
        name: 'Teacher B',
        subjects_history: [{ subject_id: 1, role: 'Teórico' }],
        teacher_available_modules: [
          {
            id: 3,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 1,
          },
          {
            id: 4,
            teacher_id: 1,
            day_of_week: 'Lunes',
            module_id: 2,
          },
        ],
      },
    ];

    const semesterLectures = [
      {
        id: 1,
        subject: { id: 1 },
        lecture_roles: [
          {
            id: 1,
            role: 'Teórico',
            teachers: [{ id: 1, name: 'Teacher A' }],
            hour_configs: [
              {
                id: 15,
                day_of_week: 'Lunes',
                modules: [1, 2],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        subject: { id: 1 },
        lecture_roles: [
          {
            id: 2,
            role: 'Teórico',
            teachers: [{ id: 2, name: 'Teacher B' }],
            hour_configs: [
              {
                id: 15,
                day_of_week: 'Lunes',
                modules: [1, 2],
              },
            ],
          },
        ],
      },
    ];

    const lecturesToAssign = [
      {
        id: 1,
        subClasses: [{ role: 'Teórico', num_teachers: 1 }],
      },
      {
        id: 2,
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
    (getTeacherById as jest.Mock).mockImplementation((id) =>
      teachersToAssign.find((t) => t.id === id)
    );

    // Call the function
    const result = await getAssignationsConflicts(mockSemesterId);

    // Assertions
    expect(result).toEqual({
      teacherTeaching2LectureAtSameTime: [],
      teachersBusyAtLectureTime: [],
      teachersDoNotKnowSubject: [],
      unassignedTeachers: [],
      unassignedLecturesRolesIds: [], // Lecture role not fully assigned
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
