import {
  TeacherResponseDto,
  TeacherResponseDtoHelper,
} from './dtos/response/teacherResponseDto';
import {
  addBenefit,
  deleteBenefit,
  getBenefits,
  updateBenefit,
} from './services/benefitService';
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from './services/categoryService';
import { getModules } from './services/moduleService';
import {
  addTeacher,
  dismissTeacher,
  getAllTeachersNames,
  getTeacherById,
  getTeachers,
  temporaryDismissTeacher,
  updateTeacher,
  getTeachersToAssignLectures,
} from './services/teacherService';

//Teacher
export {
  addTeacher,
  dismissTeacher,
  getAllTeachersNames,
  getTeacherById,
  getTeachers,
  TeacherResponseDto,
  TeacherResponseDtoHelper,
  temporaryDismissTeacher,
  updateTeacher,
  getTeachersToAssignLectures,
};

//Benefit
export { addBenefit, deleteBenefit, getBenefits, updateBenefit };

//Category
export { addCategory, deleteCategory, getCategories, updateCategory };

//Module
export { getModules };
