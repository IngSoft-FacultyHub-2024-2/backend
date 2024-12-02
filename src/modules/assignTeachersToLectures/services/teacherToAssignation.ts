import axios from 'axios';
import { getSemesterLecturesToAssign } from '../../semester';
import { getTeachersToAssignLectures } from '../../teacher';
import { TeacherToAssign } from '../models/teacherToAssign';
import { LectureToAssign } from '../models/lectureToAssign';

interface AssignPayload {
  teachers: { [key: string]: TeacherToAssign };
  classes: { [key: string]: LectureToAssign };
  teacher_names_with_classes: string[];
}

interface AssignationsResults {
  matches: { [lectureId: string]: { [role: string]: string[] } };
  conflicts: any;
}

export async function assignTeachersToSemesterLectures(semesterId: number) {
  const teachersToAssign = await getTeachersToAssignLectures();
  const lecturesToAssign = await getSemesterLecturesToAssign(semesterId);
  let assignPayload: AssignPayload = {
    teachers: {},
    classes: {},
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

  const matches = response.matches;
  Object.entries(matches).forEach(([lectureId, roles]) => {
    Object.entries(roles).forEach(([role, teacherIds]) => {
      teacherIds.forEach((teacherId) => {
        console.log(
          'Assigning teacher',
          teacherId,
          'to lecture',
          lectureId,
          'with role',
          role
        );
        // Uncomment and implement this function as needed
        // setTeacherToLecture(lectureId, teacherId, role);
      });
    });
  });

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
