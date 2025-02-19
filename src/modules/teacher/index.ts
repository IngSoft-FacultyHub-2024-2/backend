import { ModuleResponseDto } from './dtos/response/moduleResponseDto';
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
import { addModule, getModules, updateModule } from './services/moduleService';
import {
  addTeacher,
  dismissTeacher,
  getAllTeachersNames,
  getTeacherById,
  getTeacherOwnData,
  getTeachers,
  getTeachersContacts,
  getTeachersToAssignLectures,
  rehireTeacher,
  temporaryDismissTeacher,
  updateTeacher,
} from './services/teacherService';

//Teacher
export {
  addTeacher,
  dismissTeacher,
  getAllTeachersNames,
  getTeacherById,
  getTeacherOwnData,
  getTeachers,
  getTeachersContacts,
  getTeachersToAssignLectures,
  rehireTeacher,
  TeacherResponseDto,
  TeacherResponseDtoHelper,
  temporaryDismissTeacher,
  updateTeacher,
};

//Benefit
export { addBenefit, deleteBenefit, getBenefits, updateBenefit };

//Category
export { addCategory, deleteCategory, getCategories, updateCategory };

//Module
export { addModule, getModules, ModuleResponseDto, updateModule };
