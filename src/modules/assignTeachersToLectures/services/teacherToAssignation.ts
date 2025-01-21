import axios from 'axios';
import {
  getSemesterLecturesToAssign,
  setTeacherToLecture,
  getSemesterLectures,
  deleteTeachersAssignations,
  LectureRoleResponseDto,
  LectureResponseDto,
  getPreassignedTeachers,
} from '../../semester';
import {
  getTeacherById,
  getTeachersToAssignLectures,
  TeacherResponseDto,
} from '../../teacher';
import { TeacherToAssign } from '../models/teacherToAssign';
import { LectureToAssign } from '../models/lectureToAssign';
import { getModules, ModuleResponseDto } from '../../../modules/teacher';
import { SubjectRoles } from '../../../shared/utils/enums/subjectRoles';
import { getLectureIdsOfSubjectsIdsWithTecTeoAtSameTime } from '../../semester';

interface AssignPayload {
  teachers: { [key: string]: TeacherToAssign };
  classes: { [key: string]: LectureToAssign };
  modules: ModuleResponseDto[];
  teacher_names_with_classes: string[];
  preassigned: { [lectureId: string]: { [role: string]: string[] } };
}

interface AssignationsResults {
  matches: { [lectureId: string]: { [role: string]: string[] } };
  conflicts: any;
  status: string;
  amount_of_lectures_assigned: number;
}

export async function assignTeachersToSemesterLectures(semesterId: number) {
  const teachersToAssign = await getTeachersToAssignLectures();
  const lecturesToAssign = await getSemesterLecturesToAssign(semesterId);
  const modules = await getModules();
  const preassigned = await getPreassignedTeachers(semesterId);

  let assignPayload: AssignPayload = {
    teachers: {},
    classes: {},
    modules: modules,
    teacher_names_with_classes: [],
    preassigned: preassigned,
  };
  assignPayload.teachers = teachersToAssign.reduce(
    (acc: { [key: number]: TeacherToAssign }, teacher) => {
      acc[teacher.id] = teacher;
      return acc;
    },
    {}
  );
  const lectureIdsOfSubjectsIdsWithTecTeoAtSameTime =
    await getLectureIdsOfSubjectsIdsWithTecTeoAtSameTime(semesterId);
  assignPayload.classes = lecturesToAssign.reduce(
    (acc: { [key: number]: LectureToAssign }, lecture) => {
      acc[lecture.id] = lecture;
      return acc;
    },
    {}
  );
  const response = await sendAssignation(assignPayload);
  console.log(response.status);
  if (response.status === 'Infeasible') {
    throw new Error(
      'Fallo al asignar profesores la optimizacion, problema imposible, chequee los locks'
    );
  }
  // Delete the old lectures before assigning the new ones
  await deleteTeachersAssignations(semesterId);

  const matches = response.matches;
  let amount_of_lectures_assigned = 0;
  await Promise.all(
    Object.entries(matches).map(async ([lectureId, roles]) => {
      await Promise.all(
        Object.entries(roles).map(async ([role, teacherIds]) => {
          await Promise.all(
            teacherIds.map(async (teacherId) => {
              console.log(
                'Assigning teacher',
                teacherId,
                'to lecture',
                lectureId,
                'with role',
                role
              );
              amount_of_lectures_assigned += 1;
              const is_technology_teacher =
                role === SubjectRoles.TECHNOLOGY &&
                lectureIdsOfSubjectsIdsWithTecTeoAtSameTime.includes(
                  Number(lectureId)
                );
              await setTeacherToLecture(
                Number(lectureId),
                Number(teacherId),
                role,
                is_technology_teacher
              );
            })
          );
        })
      );
    })
  );
  response.amount_of_lectures_assigned = amount_of_lectures_assigned;
  return response;
}

async function sendAssignation(
  assignPayload: AssignPayload
): Promise<AssignationsResults> {
  try {
    const response = await axios.post(
      process.env.ALGORITHM_URL + '/assignTeachers',
      assignPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers if needed, e.g., authorization token
          // 'Authorization': 'Bearer your_token_here'
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      console.error('Axios error when connecting to algorithm server:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      // Throw a custom error with detailed information
      throw new Error(
        `Request failed with status ${error.response?.status}: ${error.response?.statusText}. ${
          JSON.stringify(error.response?.data) || 'No additional error details.'
        }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        'Unexpected error when connecting to algorithm server:',
        error
      );
      throw new Error('An unexpected error occurred during the request.');
    }
  }
}

export async function getAssignationsConflicts(semesterId: number) {
  const unassignedTeachers = await getUnassignedTeachers(semesterId);
  const unassignedLecturesRolesIds =
    await getUnassignedLecturesRolesIds(semesterId);
  const teachersLectureConflicts =
    await getTeachersLectureConflicts(semesterId);
  return {
    ...teachersLectureConflicts,
    unassignedTeachers: unassignedTeachers,
    unassignedLecturesRolesIds: unassignedLecturesRolesIds,
  };
}

async function getUnassignedTeachers(semesterId: number) {
  const teachersToAssign = await getTeachersToAssignLectures();
  const semesterLectures = await getSemesterLectures(semesterId);
  const unassignedTeachers = teachersToAssign.filter((teacher) => {
    return !semesterLectures.some((lecture) =>
      lecture.lecture_roles.some((role) =>
        role.teachers.some((t) => t.id === teacher.id)
      )
    );
  });
  return unassignedTeachers;
}

async function getUnassignedLecturesRolesIds(semesterId: number) {
  const lecturesToAssign = await getSemesterLecturesToAssign(semesterId);
  const semesterLectures = await getSemesterLectures(semesterId);
  // Extract unassigned lectures
  const unassignedLectures = semesterLectures.flatMap((lecture) => {
    const lectureToAssign = lecturesToAssign.find(
      (assign) => assign.id === lecture.id
    );

    if (!lectureToAssign) {
      // If the lecture is not in `lecturesToAssign`, consider all roles unassigned
      return lecture.lecture_roles;
    }

    return lecture.lecture_roles.filter((role) => {
      const requiredTeachers = lectureToAssign.subClasses.filter(
        (subclass) => subclass.role === role.role
      )[0].num_teachers;
      const assignedTeachers = role.teachers.length;

      // Role is unassigned if the required number of teachers is not met
      return assignedTeachers < requiredTeachers;
    });
  });

  const unassignedLecturesIds = unassignedLectures.map((lecture) => lecture.id);

  return unassignedLecturesIds;
}

async function getTeachersLectureConflicts(semesterId: number) {
  const teachersBusyAtLectureTime: any[] = [];
  const teachersDoNotKnowSubject: any[] = [];
  const semesterLectures = await getSemesterLectures(semesterId);
  const teacherTeaching2LectureAtSameTime =
    teachersTeaching2LecturesAtSameTime(semesterLectures);
  const teachers: { [key: number]: TeacherResponseDto } = {};

  for (const lecture of semesterLectures) {
    for (const role of lecture.lecture_roles) {
      for (const teacher of role.teachers) {
        if (!teachers[teacher.id]) {
          teachers[teacher.id] = await getTeacherById(teacher.id, true);
        }
      }
    }
  }
  semesterLectures.forEach((lecture) => {
    lecture.lecture_roles.forEach((role) => {
      role.teachers.forEach(async (t) => {
        const teacher = teachers[t.id];
        if (!isTeacherAvailableAtLectureTime(teacher, role)) {
          teachersBusyAtLectureTime.push(teacher, role);
        }
        if (!canTeacherTeachLecture(teacher, lecture.subject, role)) {
          teachersDoNotKnowSubject.push(teacher, lecture.subject, role);
        }
      });
    });
  });
  return {
    teachersBusyAtLectureTime,
    teachersDoNotKnowSubject,
    teacherTeaching2LectureAtSameTime,
  };
}

function isTeacherAvailableAtLectureTime(
  teacher: TeacherResponseDto,
  role: LectureRoleResponseDto
) {
  const isAvailable = role.hour_configs.every((config) => {
    return config.modules.every((module) => {
      const isModuleAvailable = teacher.teacher_available_modules.some(
        (teacherModule) => {
          return (
            teacherModule.day_of_week === config.day_of_week &&
            teacherModule.module_id === module
          );
        }
      );
      return isModuleAvailable;
    });
  });

  return isAvailable;
}

function getSubjectHeKnowHowToTeach(teacher: TeacherResponseDto) {
  return teacher.subjects_history?.map((history) => ({
    subject: history.subject_id.toString(),
    role: [history.role],
  }));
}

function canTeacherTeachLecture(
  teacher: TeacherResponseDto,
  subject: any,
  role: LectureRoleResponseDto
) {
  const subjectHeKnowHowToTeach = getSubjectHeKnowHowToTeach(teacher);
  if (!subjectHeKnowHowToTeach) {
    return false;
  }
  return subjectHeKnowHowToTeach.some((subjectHeKnow) => {
    return (
      subjectHeKnow.subject === subject.id.toString() &&
      subjectHeKnow.role.includes(role.role)
    );
  });
}

function teachersTeaching2LecturesAtSameTime(
  semesterLectures: LectureResponseDto[]
): { teacherId: number; conflictingLectures: LectureResponseDto[] }[] {
  const teacherSchedule: Record<
    number,
    { day: string; modules: Set<number> }[]
  > = {};

  const conflictingTeachers: {
    teacherId: number;
    conflictingLectures: LectureResponseDto[];
  }[] = [];

  for (const lecture of semesterLectures) {
    for (const role of lecture.lecture_roles) {
      for (const teacher of role.teachers) {
        if (!teacherSchedule[teacher.id]) {
          teacherSchedule[teacher.id] = [];
        }

        for (const hourConfig of role.hour_configs) {
          // Check for conflicts with the teacher's existing schedule
          for (const schedule of teacherSchedule[teacher.id]) {
            if (schedule.day === hourConfig.day_of_week) {
              const overlappingModules = hourConfig.modules.filter((module) =>
                schedule.modules.has(module)
              );
              if (overlappingModules.length > 0) {
                // Add the teacher and conflicting lecture to the result
                conflictingTeachers.push({
                  teacherId: teacher.id,
                  conflictingLectures: [lecture],
                });
                return conflictingTeachers;
              }
            }
          }

          // Add current hourConfig to the teacher's schedule
          teacherSchedule[teacher.id].push({
            day: hourConfig.day_of_week,
            modules: new Set(hourConfig.modules),
          });
        }
      }
    }
  }

  return conflictingTeachers; // Return the list of teachers with conflicting lectures
}
