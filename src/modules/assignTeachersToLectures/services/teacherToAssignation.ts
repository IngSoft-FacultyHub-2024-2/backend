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

export async function assignTeachersToSemesterLectures(semesterId: number) {
  const teachersToAssign = await getTeachersToAssignLectures();
  const lecturesToAssign = await getSemesterLecturesToAssign(1);
  let assignPayload: AssignPayload = {
    teachers: {},
    classes: {},
    teacher_names_with_classes: [],
  };
  assignPayload.teachers = teachersToAssign.reduce(
    (acc: { [key: string]: TeacherToAssign }, teacher) => {
      acc[teacher.id.toString()] = teacher;
      return acc;
    },
    {}
  );

  assignPayload.classes = lecturesToAssign.reduce(
    (acc: { [key: string]: LectureToAssign }, lecture) => {
      acc[lecture.id.toString()] = lecture;
      return acc;
    },
    {}
  );
  //const response = sendAssignation(assignPayload);

  return assignPayload;
}

async function sendAssignation(assignPayload: AssignPayload) {
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
