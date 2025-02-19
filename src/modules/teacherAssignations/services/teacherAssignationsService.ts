import axios from 'axios';
import { SubjectRoles } from '../../../shared/utils/enums/subjectRoles';
import {
  deleteTeachersAssignations,
  getLectureIdsOfSubjectsIdsWithTecTeoAtSameTime,
  getPreassignedTeachers,
  getSemesterLectures,
  getSemesterLecturesToAssign,
  LectureResponseDto,
  LectureRoleResponseDto,
  setTeacherToLecture,
} from '../../semester';
import { LectureGroupResponseDto } from '../../semester/dtos/response/lectureResponseDto';
import {
  getModules,
  getTeacherById,
  getTeachersToAssignLectures,
  ModuleResponseDto,
  TeacherResponseDto,
} from '../../teacher';
import { LectureToAssign } from '../models/lectureToAssign';
import { TeacherToAssign } from '../models/teacherToAssign';

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

  // Set the amount of teachers to assign to each lecture lock as the number of teacher they are there
  setNumberOfTeacherToLockedLectures(preassigned, assignPayload);
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

function setNumberOfTeacherToLockedLectures(
  preassigned: { [lectureId: string]: { [role: string]: string[] } },
  assignPayload: AssignPayload
) {
  for (const lectureId in preassigned) {
    for (const role in preassigned[lectureId]) {
      const lectureToAssign = assignPayload.classes[
        Number(lectureId)
      ].subClasses.find((subclass) => {
        return subclass.role === role;
      });
      if (lectureToAssign) {
        lectureToAssign.num_teachers = preassigned[lectureId][role].length;
        console.log(lectureToAssign.num_teachers);
      }
    }
  }
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
          JSON.stringify(error.response?.data) || 'Detalles no disponibles.'
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
  console.log(teachersLectureConflicts);
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
  const teachersBusyAtLectureTime: {
    teacher: TeacherResponseDto;
    lectureRole: LectureRoleResponseDto;
    subject: any;
    hoursConfig: any;
  }[] = [];
  const teachersDoNotKnowSubject: {
    teacher: TeacherResponseDto;
    lectureRole: LectureRoleResponseDto;
    subject: any;
  }[] = [];
  const teachersRejectedLectures: {
    teacher: TeacherResponseDto;
    lectureGroups: LectureGroupResponseDto[];
    subject: any;
  }[] = [];

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
        const modulesWhenBusy = busyTeacherModulesAtLectureTime(teacher, role);
        if (modulesWhenBusy.length > 0) {
          teachersBusyAtLectureTime.push({
            teacher: teacher,
            subject: lecture.subject,
            lectureRole: role,
            hoursConfig: modulesWhenBusy,
          });
        }
        let roleString = role.role;
        if (t.is_technology_teacher) {
          roleString = SubjectRoles.TECHNOLOGY;
        }
        if (!canTeacherTeachLecture(teacher, lecture.subject, roleString)) {
          teachersDoNotKnowSubject.push({
            teacher: teacher,
            subject: lecture.subject,
            lectureRole: role,
          });
        }
        if (t.review?.approved === false) {
          //si no esta en la lista, pusheamos
          const teacherReject = {
            teacher: teacher,
            lectureGroups: lecture.lecture_groups,
            subject: lecture.subject,
          };

          const isAlreadyListed = teachersRejectedLectures.some((teacher) => {
            return (
              teacher.teacher.id === teacherReject.teacher.id &&
              teacher.subject.id === teacherReject.subject.id &&
              teacher.lectureGroups === teacherReject.lectureGroups
            );
          });

          if (!isAlreadyListed) {
            teachersRejectedLectures.push(teacherReject);
          }
        }
      });
    });
  });
  return {
    teachersBusyAtLectureTime,
    teachersDoNotKnowSubject,
    teacherTeaching2LectureAtSameTime,
    teachersRejectedLectures,
  };
}

function busyTeacherModulesAtLectureTime(
  teacher: TeacherResponseDto,
  role: LectureRoleResponseDto
) {
  const notAvailableDates: { day_of_week: string; module_id: number }[] = [];

  role.hour_configs.forEach((config) => {
    config.modules.forEach((module) => {
      const isModuleAvailable = teacher.teacher_available_modules.some(
        (teacherModule) =>
          teacherModule.day_of_week === config.day_of_week &&
          teacherModule.module_id === module
      );

      if (!isModuleAvailable) {
        // Solo agregamos si el módulo NO está disponible
        notAvailableDates.push({
          day_of_week: config.day_of_week,
          module_id: module,
        });
      }
    });
  });

  return notAvailableDates;
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
  role: string
) {
  const subjectHeKnowHowToTeach = getSubjectHeKnowHowToTeach(teacher);
  if (!subjectHeKnowHowToTeach) {
    return false;
  }
  return subjectHeKnowHowToTeach.some((subjectHeKnow) => {
    return (
      subjectHeKnow.subject === subject.id.toString() &&
      subjectHeKnow.role.includes(role)
    );
  });
}

function teachersTeaching2LecturesAtSameTime(
  semesterLectures: LectureResponseDto[]
): {
  teacherName: string;
  conflictingLectures: {
    first: LectureResponseDto;
    second: LectureResponseDto;
  }[];
}[] {
  const teacherSchedule: Record<
    number,
    { day: string; modules: Set<number>; lecture: LectureResponseDto }[]
  > = {};

  const conflictingTeachers: {
    teacherName: string;
    conflictingLectures: {
      first: LectureResponseDto;
      second: LectureResponseDto;
      modules: number[];
      day_of_week: string;
    }[];
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
                  teacherName: teacher.name + ' ' + teacher.surname,
                  conflictingLectures: [
                    {
                      first: lecture,
                      second: schedule.lecture,
                      modules: overlappingModules,
                      day_of_week: hourConfig.day_of_week,
                    },
                  ],
                });
              }
            }
          }

          // Add current hourConfig to the teacher's schedule
          teacherSchedule[teacher.id].push({
            day: hourConfig.day_of_week,
            modules: new Set(hourConfig.modules),
            lecture: lecture,
          });
        }
      }
    }
  }
  return conflictingTeachers;
}
