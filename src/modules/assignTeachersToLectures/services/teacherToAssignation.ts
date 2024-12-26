import axios from 'axios';
import {
  getSemesterLecturesToAssign,
  setTeacherToLecture,
  getSemesterLectures,
} from '../../semester';
import { getTeachersToAssignLectures } from '../../teacher';
import { TeacherToAssign } from '../models/teacherToAssign';
import { LectureToAssign } from '../models/lectureToAssign';
import { deleteTeachersAssignations } from '../../semester/services/semesterService';
import { getModules } from '../../../modules/teacher';
import Module from '../../teacher/repositories/models/Module';

interface AssignPayload {
  teachers: { [key: string]: TeacherToAssign };
  classes: { [key: string]: LectureToAssign };
  modules: Module[];
  teacher_names_with_classes: string[];
}

interface AssignationsResults {
  matches: { [lectureId: string]: { [role: string]: string[] } };
  conflicts: any;
}

export async function assignTeachersToSemesterLectures(semesterId: number) {
  const teachersToAssign = await getTeachersToAssignLectures();
  const lecturesToAssign = await getSemesterLecturesToAssign(semesterId);
  const modules = await getModules();

  let assignPayload: AssignPayload = {
    teachers: {},
    classes: {},
    modules: modules,
    teacher_names_with_classes: [],
  };
  assignPayload.teachers = teachersToAssign.reduce(
    (acc: { [key: number]: TeacherToAssign }, teacher) => {
      acc[teacher.id] = teacher;
      return acc;
    },
    {}
  );

  assignPayload.classes = lecturesToAssign.reduce(
    (acc: { [key: number]: LectureToAssign }, lecture) => {
      acc[lecture.id] = lecture;
      return acc;
    },
    {}
  );
  const response = await sendAssignation(assignPayload);

  // Delete the old lectures before assigning the new ones
  // TODO: filter out the locked lectures
  await deleteTeachersAssignations(semesterId);

  const matches = response.matches;

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
              await setTeacherToLecture(
                Number(lectureId),
                Number(teacherId),
                role
              );
            })
          );
        })
      );
    })
  );

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
  return {
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
