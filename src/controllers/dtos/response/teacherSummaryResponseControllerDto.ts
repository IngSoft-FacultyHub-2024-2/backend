import {Teacher, Contact} from "../../../modules/teacher";

export interface TeacherSummaryResponseControllerDto {
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

export class TeacherSummaryResponseControllerDtoHelper {
  public static fromModel(teacher: Teacher, associatedSubjects: string[]): TeacherSummaryResponseControllerDto {
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