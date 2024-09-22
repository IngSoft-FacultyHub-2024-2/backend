import { addTeacher, getBenefits, getCategories, getTeacherById, getTeachers, getAllTeachersNames, dismissTeacher, temporaryDismissTeacher } from "./services/teacherService";
import { TeacherResponseDto, TeacherResponseDtoHelper } from "./dtos/response/teacherResponseDto";

export { addTeacher, getTeacherById, getTeachers, 
    TeacherResponseDto, TeacherResponseDtoHelper, 
    getBenefits, getCategories, getAllTeachersNames, dismissTeacher,
    temporaryDismissTeacher };
