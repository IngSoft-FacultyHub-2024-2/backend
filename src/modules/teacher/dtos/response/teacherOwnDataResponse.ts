import CaesCourse from '../../repositories/models/CaesCourse';
import Contact from '../../repositories/models/Contact';
import Prize from '../../repositories/models/Prize';
import Teacher from '../../repositories/models/Teacher';
import TeacherAvailableModule from '../../repositories/models/TeacherAvailableModules';
import TeacherBenefit from '../../repositories/models/TeacherBenefit';
import TeacherSubjectGroup from '../../repositories/models/TeacherSubjectGroup';
import TeacherSubjectOfInterest from '../../repositories/models/TeacherSubjectOfInterest';
import { TeacherSubjectHistoryResponseDto } from './teacherSubjectHistoryResponseDto';

export interface TeacherResponseDto {
  id: number;
  name: string;
  surname: string;
  birth_date: Date | null;
  employee_number: number | null;
  cv_file: string | null;
  id_photo: string | null;
  linkedin_link: string | null;
  graduated: boolean;
  subjects_history: TeacherSubjectHistoryResponseDto[] | null;
  subjects_of_interest: TeacherSubjectOfInterest[];
  prizes: Prize[];
  caes_courses: CaesCourse[];
  contacts: Contact[];
  benefits: TeacherBenefit[];
  teacher_subject_groups: TeacherSubjectGroup[];
  teacher_available_modules: TeacherAvailableModule[];
}

export class TeacherResponseDtoHelper {
  public static fromModel(
    teacher: Teacher,
    subjectsHistory: TeacherSubjectHistoryResponseDto[] | null = null
  ): TeacherResponseDto {
    return {
      id: teacher.id,
      name: teacher.name,
      surname: teacher.surname,
      birth_date: teacher.birth_date,
      employee_number: teacher.employee_number,
      cv_file: teacher.cv_file,
      id_photo: teacher.id_photo,
      linkedin_link: teacher.linkedin_link,
      graduated: teacher.graduated,
      subjects_history: subjectsHistory,
      subjects_of_interest: teacher.subjects_of_interest,
      prizes: teacher.prizes,
      caes_courses: teacher.caes_courses,
      contacts: teacher.contacts,
      benefits: teacher.benefits,
      teacher_subject_groups: teacher.teacher_subject_groups,
      teacher_available_modules: teacher.teacher_available_modules,
    };
  }
}
