import { Teacher, Contact } from "../../../modules/teacher";

export interface GetTeachersResponseDto {
  teachers: TeacherInfoDto[];
  totalPages: number;
  currentPage: number;
}

interface TeacherInfoDto {
  id: number;
  name: string;
  surname: string;
  birth_date: Date | null;
  employee_number: number | null;
  state: 'activo' | 'baja temporal' | 'baja';
  associated_subjects: string[];
  contacts: Contact[];
  unsubscribe_risk: number;
}

export class GetTeachersResponseDtoHelper {
  public static fromModel(teacher: Teacher, associatedSubjects: string[]): TeacherInfoDto {
    return {
      id: teacher.id,
      name: teacher.name,
      surname: teacher.surname,
      birth_date: teacher.birth_date,
      employee_number: teacher.employee_number,
      state: teacher.state,
      associated_subjects: associatedSubjects,
      contacts: teacher.contacts,
      unsubscribe_risk: teacher.unsubscribe_risk,
    };
  }
}