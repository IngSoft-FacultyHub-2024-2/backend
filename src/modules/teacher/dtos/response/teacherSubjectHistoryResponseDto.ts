import { SubjectResponseDto } from "../../../subject";
import TeacherSubjectHistory from "../../repositories/models/TeacherSubjectHistory";


export interface TeacherSubjectHistoryResponseDto {
    id: number;
    teacher_id: number;
    subject_id: number;
    role: string;
    start_date: Date;
    end_date: Date | null;
    subject: SubjectResponseDto | null;
    }

export class TeacherSubjectHistoryResponseDtoHelper {
    public static fromModel(teacherSubjectHistory: TeacherSubjectHistory, subject: SubjectResponseDto | null = null): TeacherSubjectHistoryResponseDto {
      return {
        id: teacherSubjectHistory.id,
        teacher_id: teacherSubjectHistory.teacher_id,
        subject_id: teacherSubjectHistory.subject_id,
        role: teacherSubjectHistory.role,
        start_date: teacherSubjectHistory.start_date,
        end_date: teacherSubjectHistory.end_date,
        subject: subject,
      };
    }
}