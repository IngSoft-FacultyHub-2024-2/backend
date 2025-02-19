import {
  getSemesterLectures,
  getSemesterLecturesToAssign,
} from '../../src/modules/semester';
import {
  getTeacherById,
  getTeachersToAssignLectures,
} from '../../src/modules/teacher';
import { getAssignationsConflicts } from '../../src/modules/teacherAssignations';

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
  let teachersToAssign: any[];
  let semesterLectures: any[];
  let lecturesToAssign: any[];

  beforeEach(() => {
    jest.clearAllMocks();

    teachersToAssign = [
      {
        id: 1,
        name: 'Teacher A',
        surname: 'Smith',
        subjects_history: [{ subject_id: 1, role: 'Teórico' }],
        teacher_available_modules: [
          { teacher_id: 1, day_of_week: 'Lunes', module_id: 1 },
          { teacher_id: 1, day_of_week: 'Lunes', module_id: 2 },
        ],
      },
    ];

    semesterLectures = [
      {
        id: 1,
        subject: { id: 1 },
        lecture_roles: [
          {
            id: 1,
            role: 'Teórico',
            teachers: [{ id: 1, name: 'Teacher A', surname: 'Smith' }],
            hour_configs: [{ day_of_week: 'Lunes', modules: [1, 2] }],
          },
        ],
      },
    ];

    lecturesToAssign = [
      {
        id: 1,
        subClasses: [{ role: 'Teórico', num_teachers: 2 }],
      },
    ];

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
  });

  it('should return teachers that do not know the subject', async () => {
    teachersToAssign[0].subjects_history = [{ subject_id: 2, role: 'Teórico' }];
    const result = await getAssignationsConflicts(mockSemesterId);

    expect(result.teachersDoNotKnowSubject).toEqual([
      {
        teacher: teachersToAssign[0],
        subject: semesterLectures[0].subject,
        lectureRole: semesterLectures[0].lecture_roles[0],
      },
    ]);
  });

  it('should return teachers unavailable at lecture time (wrong day)', async () => {
    teachersToAssign[0].teacher_available_modules = [
      { teacher_id: 1, day_of_week: 'Martes', module_id: 2 },
    ];

    const result = await getAssignationsConflicts(mockSemesterId);

    expect(result.teachersBusyAtLectureTime).toEqual([
      {
        teacher: teachersToAssign[0],
        subject: semesterLectures[0].subject,
        lectureRole: semesterLectures[0].lecture_roles[0],
        hoursConfig: [
          { day_of_week: 'Lunes', module_id: 1 },
          { day_of_week: 'Lunes', module_id: 2 },
        ],
      },
    ]);
  });

  it('should return teachers teaching two lectures at the same time', async () => {
    semesterLectures.push({
      id: 2,
      subject: { id: 1 },
      lecture_roles: [
        {
          id: 2,
          role: 'Teórico',
          teachers: [{ id: 1, name: 'Teacher A', surname: 'Smith' }],
          hour_configs: [{ day_of_week: 'Lunes', modules: [1, 2] }],
        },
      ],
    });

    const result = await getAssignationsConflicts(mockSemesterId);

    expect(result.teacherTeaching2LectureAtSameTime).toEqual([
      {
        teacherName: 'Teacher A Smith',
        conflictingLectures: [
          {
            first: semesterLectures[1],
            second: semesterLectures[0],
            modules: [1, 2],
            day_of_week: 'Lunes',
          },
        ],
      },
    ]);
  });

  it('should throw an error if a dependency fails', async () => {
    (getTeachersToAssignLectures as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch teachers')
    );

    await expect(getAssignationsConflicts(mockSemesterId)).rejects.toThrow(
      'Failed to fetch teachers'
    );

    expect(getTeachersToAssignLectures).toHaveBeenCalledTimes(1);
    expect(getSemesterLectures).not.toHaveBeenCalled();
    expect(getSemesterLecturesToAssign).not.toHaveBeenCalled();
  });
});
