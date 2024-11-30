import {
  TeacherResponseDto,
  TeacherResponseDtoHelper,
} from './dtos/response/teacherResponseDto';
import { getModules } from './services/moduleService';
import {
  addTeacher,
  dismissTeacher,
  getAllTeachersNames,
  getBenefits,
  getCategories,
  getTeacherById,
  getTeachers,
  temporaryDismissTeacher,
  updateTeacher,
  getTeachersToAssignLectures,
} from './services/teacherService';

export {
  addTeacher,
  dismissTeacher,
  getAllTeachersNames,
  getBenefits,
  getCategories,
  getModules,
  getTeacherById,
  getTeachers,
  TeacherResponseDto,
  TeacherResponseDtoHelper,
  temporaryDismissTeacher,
  updateTeacher,
  getTeachersToAssignLectures,
};
