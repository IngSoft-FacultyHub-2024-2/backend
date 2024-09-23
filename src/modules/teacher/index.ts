import { 
    addTeacher,
    getBenefits,
    getCategories,
    getTeacherById,
    getTeachers,
    getAllTeachersNames,
    dismissTeacher,
    temporaryDismissTeacher,
    updateTeacher
} from "./services/teacherService";
import { TeacherResponseDto, TeacherResponseDtoHelper } from "./dtos/response/teacherResponseDto";

export { 
    addTeacher,
    getTeacherById,
    getTeachers, 
    TeacherResponseDto,
    TeacherResponseDtoHelper, 
    getBenefits,
    getCategories,
    getAllTeachersNames,
    dismissTeacher,
    temporaryDismissTeacher,
    updateTeacher
};
