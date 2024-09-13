import { SubjectResponseDto, HourConfigResponseDto } from "../../../modules/subject";

export interface GetSubjectsResponseDto {
  subjects: SubjectInfoDto[];
  totalPages: number;
  currentPage: number;
}

interface SubjectInfoDto {
  id: number;
  name: string;
  subject_code: string;
  study_plan_year: number;
  associated_coordinator_name: string
  index: number;
  hour_configs?: HourConfigResponseDto[];
}

export class GetSubjectsResponseDtoHelper {
  // Method to convert Subject model instance to SubjectResponseDto
  public static fromModel(subject: SubjectResponseDto, associated_coordinator_name: string): SubjectInfoDto {
    return {
      id: subject.id,
      name: subject.name,
      subject_code: subject.subject_code,
      study_plan_year: subject.study_plan_year,
      associated_coordinator_name: associated_coordinator_name,
      index: subject.index,
      hour_configs: subject.hour_configs,
    };
  }
}