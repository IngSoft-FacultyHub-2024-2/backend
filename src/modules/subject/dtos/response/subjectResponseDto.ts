import { HourConfigResponseDto, HourConfigResponseDtoHelper } from './hourConfigResponseDto';
import { NeedResponseDto, NeedResponseDtoHelper } from './needResponseDto';
import Subject from "../../repositories/models/Subject";
import { SubjectEventResponseDto, SubjectEventResponseDtoHelper } from './subjectEventResponseDto';

export interface SubjectResponseDto {
    id: number;
    name: string;
    subject_code: string;
    study_plan_year: number;
    associated_teacher: number;
    associated_coordinator: number;
    index: number;
    frontal_hours: number;
    intro_folder?: string | null;
    subject_folder?: string | null;
    technologies?: string | null;
    notes?: string | null;
    valid?: boolean;
    hourConfigs?: HourConfigResponseDto[];
    needs?: NeedResponseDto[];
    events?: SubjectEventResponseDto[];
}

export class SubjectResponseDtoHelper {
  // Method to convert Subject model instance to SubjectResponseDto
  public static fromModel(subject: Subject): SubjectResponseDto {
    return {
      id: subject.id,
      name: subject.name,
      subject_code: subject.subject_code,
      study_plan_year: subject.study_plan_year,
      associated_teacher: subject.associated_teacher,
      associated_coordinator: subject.associated_coordinator,
      index: subject.index,
      frontal_hours: subject.frontal_hours,
      intro_folder: subject.intro_folder,
      subject_folder: subject.subject_folder,
      technologies: subject.technologies,
      notes: subject.notes,
      valid: subject.valid,
      hourConfigs: subject.hourConfigs?.map((hc) => HourConfigResponseDtoHelper.fromModel(hc)) || [],
      needs: subject.needs?.map((n) => NeedResponseDtoHelper.fromModel(n)) || [],
      events: subject.events?.map((e) => SubjectEventResponseDtoHelper.fromModel(e)) || [],
    };
  }
}