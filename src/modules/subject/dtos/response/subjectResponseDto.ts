import { HourConfigResponseDto, HourConfigResponseDtoHelper } from './hourConfigResponseDto';
import { NeedResponseDto, NeedResponseDtoHelper } from './needResponseDto';
import Subject from "../../repositories/models/Subject";
import { SubjectEventResponseDto, SubjectEventResponseDtoHelper } from './subjectEventResponseDto';
import { TeacherResponseDto } from '../../../teacher';
import StudyPlan from '../../repositories/models/StudyPlan';

export interface SubjectResponseDto {
    id: number;
    name: string;
    subject_code: string;
    acronym: string;
    study_plan_id: number;
    study_plan: StudyPlan | null;
    associated_coordinator: TeacherResponseDto | null;
    index: number;
    frontal_hours: number;
    total_hours: number;
    intro_folder?: string | null;
    subject_folder?: string | null;
    technologies?: string | null;
    notes?: string | null;
    valid: boolean;
    hour_configs?: HourConfigResponseDto[];
    needs?: NeedResponseDto[];
    needs_notes: string;
    events?: SubjectEventResponseDto[];
}

export class SubjectResponseDtoHelper {
  // Method to convert Subject model instance to SubjectResponseDto
  public static fromModel(subject: Subject, teacherDto: TeacherResponseDto | null = null): SubjectResponseDto {
    return {
      id: subject.id,
      name: subject.name,
      subject_code: subject.subject_code,
      acronym: subject.acronym,
      study_plan: subject.study_plan,
      study_plan_id: subject.study_plan_id,
      associated_coordinator: teacherDto,
      index: subject.index,
      frontal_hours: subject.frontal_hours,
      total_hours: subject.total_hours,
      intro_folder: subject.intro_folder,
      subject_folder: subject.subject_folder,
      technologies: subject.technologies,
      notes: subject.notes,
      valid: subject.valid,
      hour_configs: subject.hour_configs?.map((hc) => HourConfigResponseDtoHelper.fromModel(hc)) || [],
      needs: subject.needs?.map((n) => NeedResponseDtoHelper.fromModel(n)) || [],
      needs_notes: subject.needs_notes,
      events: subject.events?.map((e) => SubjectEventResponseDtoHelper.fromModel(e)) || [],
    };
  }
}