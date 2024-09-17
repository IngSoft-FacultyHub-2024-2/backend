import Teacher from '../../repositories/models/Teacher';
import { SubjectResponseDto } from '../../../subject';
import TeacherSubjectHistory from '../../repositories/models/TeacherSubjectHistory';
import TeacherSubjectOfInterest from '../../repositories/models/TeacherSubjectOfInterest';
import Prize from '../../repositories/models/Prize';
import CaesCourse from '../../repositories/models/CaesCourse';
import Contact from '../../repositories/models/Contact';
import TeacherCategory from '../../repositories/models/TeacherCategory';
import TeacherBenefit from '../../repositories/models/TeacherBenefit';
import TeacherSubjectGroup from '../../repositories/models/TeacherSubjectGroup';
import TeacherAvailableModule from '../../repositories/models/TeacherAvailableModules';
import { TeacherSubjectHistoryResponseDtoHelper } from './teacherSubjectHistoryResponseDto';

export interface TeacherResponseDto {
    id: number;
    name: string;
    surname: string;
    birth_date: Date | null;
    employee_number: number | null;
    cv_file: string | null; 
    how_they_found_us: string | null;
    id_photo: string | null;
    hiring_date: Date | null;
    linkedin_link: string | null;
    graduated: boolean;
    notes: string | null;
    state: 'activo' | 'baja temporal' | 'baja';
    unsubscribe_risk: number;
    subjects_history: TeacherSubjectHistoryResponseDtoHelper[] | null;
    subjects_of_interest: TeacherSubjectOfInterest[];
    prizes: Prize[];
    caes_courses: CaesCourse[];
    contacts: Contact[];
    categories: TeacherCategory[];
    benefits: TeacherBenefit[];
    teacher_subject_groups: TeacherSubjectGroup[];
    teacher_available_modules: TeacherAvailableModule[];
}

export class TeacherResponseDtoHelper {
    public static fromModel(teacher: Teacher, subjectsHistory: TeacherSubjectHistoryResponseDtoHelper[] | null = null): TeacherResponseDto {
      return {
        id: teacher.id,
        name: teacher.name,
        surname: teacher.surname,
        birth_date: teacher.birth_date,
        employee_number: teacher.employee_number,
        cv_file: teacher.cv_file,
        how_they_found_us: teacher.how_they_found_us,
        id_photo: teacher.id_photo,
        hiring_date: teacher.hiring_date,
        linkedin_link: teacher.linkedin_link,
        graduated: teacher.graduated,
        notes: teacher.notes,
        state: teacher.state,
        unsubscribe_risk: teacher.unsubscribe_risk,
        subjects_history: subjectsHistory, 
        subjects_of_interest: teacher.subjects_of_interest,
        prizes: teacher.prizes,
        caes_courses: teacher.caes_courses,
        contacts: teacher.contacts,
        categories: teacher.categories,
        benefits: teacher.benefits,
        teacher_subject_groups: teacher.teacher_subject_groups,
        teacher_available_modules: teacher.teacher_available_modules
      };
    }
  }
  