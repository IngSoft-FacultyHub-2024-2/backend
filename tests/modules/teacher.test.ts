import {
  getSubjectById,
  teacherCoordinatorSubjects,
} from '../../src/modules/subject';
import teacherRepository from '../../src/modules/teacher/repositories/teacherRepository';
import {
  addTeacher,
  dismissTeacher,
  getAllTeachersNames,
  getTeacherById,
  getTeachers,
  temporaryDismissTeacher,
  updateTeacher,
  getTeachersToAssignLectures,
} from '../../src/modules/teacher/services/teacherService';
import { ResourceNotFound } from '../../src/shared/utils/exceptions/customExceptions';

// Mocking the necessary modules
jest.mock('../../src/modules/teacher/repositories/teacherRepository');
jest.mock('../../src/modules/subject', () => ({
  getSubjectById: jest.fn(),
  teacherCoordinatorSubjects: jest.fn(),
}));

// Helper function to clean undefined and empty arrays from objects
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

describe('Teacher Service', () => {
  // Test for addTeacher function
  describe('addTeacher', () => {
    it('should call addTeacher with the correct teacher data and return the result', async () => {
      const mockTeacher = { name: 'John', surname: 'Doe1' };
      (teacherRepository.addTeacher as jest.Mock).mockResolvedValue(
        mockTeacher
      );

      const result = await addTeacher(mockTeacher);

      expect(teacherRepository.addTeacher).toHaveBeenCalledWith(mockTeacher);
      expect(result).toEqual(mockTeacher);
    });

    it('should throw an error if repository fails', async () => {
      const mockTeacher = { name: 'John', surname: 'Doe1' };
      const mockError = new Error('Failed to add teacher');

      (teacherRepository.addTeacher as jest.Mock).mockRejectedValue(mockError);

      await expect(addTeacher(mockTeacher)).rejects.toThrow(
        'Failed to add teacher'
      );
      expect(teacherRepository.addTeacher).toHaveBeenCalledWith(mockTeacher);
    });
  });

  // Test for getTeachers function
  describe('getTeachers', () => {
    it('should return a paginated list of teachers with subject history', async () => {
      const mockTeachers = {
        rows: [
          {
            id: 1,
            name: 'John',
            surname: 'Doe',
            subjects_history: [{ subject_id: 1 }],
          },
          {
            id: 2,
            name: 'Jane',
            surname: 'Smith',
            subjects_history: [{ subject_id: 2 }],
          },
        ],
        count: 2,
      };

      const mockSubjects = [
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'Physics' },
      ];

      const mockTeacherDto = [
        {
          id: 1,
          name: 'John',
          surname: 'Doe',
          subjects_history: [
            { subject_id: 1, subject: { id: 1, name: 'Mathematics' } },
          ],
        },
        {
          id: 2,
          name: 'Jane',
          surname: 'Smith',
          subjects_history: [
            { subject_id: 2, subject: { id: 2, name: 'Physics' } },
          ],
        },
      ];

      (teacherRepository.getTeachers as jest.Mock).mockResolvedValue(
        mockTeachers
      );
      (getSubjectById as jest.Mock).mockImplementation((id) => {
        return mockSubjects.find((subject) => subject.id === id);
      });

      const result = await getTeachers();

      expect(teacherRepository.getTeachers).toHaveBeenCalledWith(
        10,
        0,
        'ASC',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(getSubjectById).toHaveBeenCalledTimes(2); // Once for each teacher's subjects_history
      expect(result.teachers.map(removeUndefinedAndEmptyArrays)).toEqual(
        mockTeacherDto
      );
      expect(result.totalPages).toEqual(1);
      expect(result.currentPage).toEqual(1);
    });

    it('should handle empty search results', async () => {
      const mockTeachers = { rows: [], count: 0 };
      (teacherRepository.getTeachers as jest.Mock).mockResolvedValue(
        mockTeachers
      );

      const result = await getTeachers(
        'NonExistentTeacher',
        undefined,
        undefined,
        'name',
        'ASC',
        1,
        10,
        true
      );

      expect(result.teachers).toEqual([]);
      expect(result.totalPages).toEqual(0);
      expect(result.currentPage).toEqual(1);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to fetch teachers');
      (teacherRepository.getTeachers as jest.Mock).mockRejectedValue(mockError);

      await expect(
        getTeachers(
          'NonExistentTeacher',
          undefined,
          undefined,
          'name',
          'ASC',
          1,
          10,
          undefined
        )
      ).rejects.toThrow('Failed to fetch teachers');
      expect(teacherRepository.getTeachers).toHaveBeenCalledWith(
        10,
        0,
        'ASC',
        true,
        'name',
        'NonExistentTeacher',
        undefined,
        undefined
      );
    });
  });

  // Test for getTeacherById function
  describe('getTeacherById', () => {
    it('should retrieve a teacher by ID if exists', async () => {
      const mockTeacher = { id: 1, name: 'John', surname: 'Doe' };
      (teacherRepository.getTeacherById as jest.Mock).mockResolvedValue(
        mockTeacher
      );

      const result = await getTeacherById(1);

      expect(teacherRepository.getTeacherById).toHaveBeenCalledWith(1);
      expect(removeUndefinedAndEmptyArrays(result)).toEqual({
        ...mockTeacher,
        subjects_history: null,
      });
    });

    it('should return teacher DTO with subjects info if includeOtherInfo is true', async () => {
      const mockTeacher = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        subjects_history: [{ subject_id: 1 }],
      };
      const mockSubjectHistory = { id: 1, name: 'Math' };
      (teacherRepository.getTeacherById as jest.Mock).mockResolvedValue(
        mockTeacher
      );
      (getSubjectById as jest.Mock).mockResolvedValue(mockSubjectHistory);
      const mockTeacherResponseDto = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        subjects_history: [{ subject_id: 1, subject: mockSubjectHistory }],
      };

      const result = await getTeacherById(1, true);

      expect(teacherRepository.getTeacherById).toHaveBeenCalledWith(1);
      expect(getSubjectById).toHaveBeenCalledWith(
        mockTeacher.subjects_history[0].subject_id
      );
      expect(removeUndefinedAndEmptyArrays(result)).toEqual(
        mockTeacherResponseDto
      );
    });

    it('should throw a ResourceNotFound error if teacher is not found', async () => {
      (teacherRepository.getTeacherById as jest.Mock).mockResolvedValue(null);

      await expect(getTeacherById(1)).rejects.toThrow(ResourceNotFound);
      expect(teacherRepository.getTeacherById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to fetch teacher');
      (teacherRepository.getTeacherById as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(getTeacherById(1)).rejects.toThrow(
        'Failed to fetch teacher'
      );
      expect(teacherRepository.getTeacherById).toHaveBeenCalledWith(1);
    });
  });

  describe('getAllTeachersNames', () => {
    it('should return all teachers names', async () => {
      const teachers = [
        { id: 1, name: 'John', surname: 'Doe' },
        { id: 1, name: 'Jane', surname: 'Smith' },
      ];
      (teacherRepository.getAllTeachersNames as jest.Mock).mockResolvedValue(
        teachers
      );

      const result = await getAllTeachersNames();

      expect(result).toEqual(teachers);
      expect(teacherRepository.getAllTeachersNames).toHaveBeenCalled();
    });
  });

  // Test for dismissTeacher function
  describe('dismissTeacher', () => {
    const mockSubject = [{ id: 1, name: 'Mathematics' }];

    it('should dismiss a teacher if not a coordinator', async () => {
      const mockTeacher = { id: 1, name: 'John', surname: 'Doe' };
      (teacherRepository.dismissTeacher as jest.Mock).mockResolvedValue(
        mockTeacher
      );
      (
        teacherRepository.deleteTeacherSubjectGroups as jest.Mock
      ).mockResolvedValue(null);
      (teacherCoordinatorSubjects as jest.Mock).mockResolvedValue([]);

      const result = await dismissTeacher(1);

      expect(teacherRepository.dismissTeacher).toHaveBeenCalledWith(1);
      expect(teacherRepository.deleteTeacherSubjectGroups).toHaveBeenCalledWith(
        1
      );
    });

    it('should throw an error if teacher is a coordinator', async () => {
      const mockError = new Error(
        'Este docente es coordinador de una materia y no puede ser dado de baja: ' +
          mockSubject.map((subject) => subject.name).join(', ')
      );
      (teacherCoordinatorSubjects as jest.Mock).mockResolvedValue(mockSubject);

      await expect(dismissTeacher(1)).rejects.toThrow(mockError);
      expect(teacherCoordinatorSubjects).toHaveBeenCalledWith(1);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to dismiss teacher');
      (teacherCoordinatorSubjects as jest.Mock).mockResolvedValue([]);
      (teacherRepository.dismissTeacher as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(dismissTeacher(1)).rejects.toThrow(
        'Failed to dismiss teacher'
      );
      expect(teacherRepository.dismissTeacher).toHaveBeenCalledWith(1);
    });
  });

  // Test for temporaryDismissTeacher function
  describe('temporaryDismissTeacher', () => {
    const mockSubject = [{ id: 1, name: 'Mathematics' }];
    it('should temporarily dismiss a teacher if not a coordinator', async () => {
      const mockTeacher = { id: 1, name: 'John', surname: 'Doe' };
      (
        teacherRepository.temporaryDismissTeacher as jest.Mock
      ).mockResolvedValue(mockTeacher);
      (
        teacherRepository.deleteTeacherSubjectGroups as jest.Mock
      ).mockResolvedValue(null);
      (teacherCoordinatorSubjects as jest.Mock).mockResolvedValue([]);

      const result = await temporaryDismissTeacher(1, new Date());

      expect(teacherRepository.temporaryDismissTeacher).toHaveBeenCalledWith(
        1,
        expect.any(Date)
      );
      expect(teacherRepository.deleteTeacherSubjectGroups).toHaveBeenCalledWith(
        1
      );
    });

    it('should throw an error if teacher is a coordinator', async () => {
      const mockError = new Error(
        'Este docente es coordinador de una materia y no puede ser dado de baja temporal: ' +
          mockSubject.map((subject) => subject.name).join(', ')
      );
      (teacherCoordinatorSubjects as jest.Mock).mockResolvedValue(mockSubject);

      await expect(temporaryDismissTeacher(1, new Date())).rejects.toThrow(
        mockError
      );
      expect(teacherCoordinatorSubjects).toHaveBeenCalledWith(1);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to temporarily dismiss teacher');
      (teacherCoordinatorSubjects as jest.Mock).mockResolvedValue([]);
      (
        teacherRepository.temporaryDismissTeacher as jest.Mock
      ).mockRejectedValue(mockError);

      await expect(temporaryDismissTeacher(1, new Date())).rejects.toThrow(
        'Failed to temporarily dismiss teacher'
      );
      expect(teacherRepository.temporaryDismissTeacher).toHaveBeenCalledWith(
        1,
        expect.any(Date)
      );
    });
  });

  describe('updateTeacher', () => {
    const mockTeacher = { id: 1, name: 'John', surname: 'Doe' };
    const mockUpdatedTeacher = { id: 1, name: 'Jane', surname: 'Smith' };

    it('should update a teacher', async () => {
      (teacherRepository.updateTeacher as jest.Mock).mockResolvedValue(
        mockUpdatedTeacher
      );

      const result = await updateTeacher(1, mockTeacher);

      expect(teacherRepository.updateTeacher).toHaveBeenCalledWith(
        1,
        mockTeacher
      );
      expect(result).toEqual(mockUpdatedTeacher);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to update teacher');
      (teacherRepository.updateTeacher as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(updateTeacher(1, mockUpdatedTeacher)).rejects.toThrow(
        'Failed to update teacher'
      );
      expect(teacherRepository.updateTeacher).toHaveBeenCalledWith(
        1,
        expect.any(Object)
      );
    });
  });
});

describe('getTeachersToAssignLectures', () => {
  it('should return formatted teacher data for assigning lectures', async () => {
    // Mock teacher data
    const mockTeachers = [
      {
        id: 1,
        subjects_history: [{ subject_id: 101, role: 'Teórico' }],
        teacher_available_modules: [
          { day_of_week: 'Lunes', module_id: 1 },
          { day_of_week: 'Lunes', module_id: 2 },
        ],
        teacher_subject_groups: [
          {
            subject_id: 101,
            members: [
              { teacher_id: 1, role: 'Teórico' },
              { teacher_id: 2, role: 'Práctico' },
            ],
          },
        ],
        getSeniorityInSemesters: jest.fn().mockResolvedValue(5),
      },
    ];

    (
      teacherRepository.getTeachersToAssignLectures as jest.Mock
    ).mockResolvedValue(mockTeachers);

    // Execute the function
    const result = await getTeachersToAssignLectures();

    // Verify the result
    expect(result).toEqual([
      {
        id: 1,
        seniority: 5,
        subject_he_know_how_to_teach: [{ subject: '101', role: ['Teórico'] }],
        available_times: {
          Monday: [1, 2],
        },
        weekly_hours_max_work: 80,
        groups: [
          {
            my_role: ['Teórico'],
            subject: '101',
            other_teacher: [{ teacher: '2', role: ['Práctico'] }],
          },
        ],
      },
    ]);

    // Verify the mocked method was called
    expect(mockTeachers[0].getSeniorityInSemesters).toHaveBeenCalled();
  });
});
