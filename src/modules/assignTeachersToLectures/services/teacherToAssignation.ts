import axios from 'axios';
import {
  getSemesterLecturesToAssign,
  setTeacherToLecture,
} from '../../semester';
import { getTeachersToAssignLectures } from '../../teacher';
import { TeacherToAssign } from '../models/teacherToAssign';
import { LectureToAssign } from '../models/lectureToAssign';
import {
  deleteTeachersAssignations,
  getPreassignedTeachers,
} from '../../semester';
import { getModules } from '../../../modules/teacher';
import Module from '../../teacher/repositories/models/Module';

interface AssignPayload {
  teachers: { [key: string]: TeacherToAssign };
  classes: { [key: string]: LectureToAssign };
  modules: Module[];
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
