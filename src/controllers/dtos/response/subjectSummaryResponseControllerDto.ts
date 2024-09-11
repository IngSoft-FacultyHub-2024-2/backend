import {SubjectResponseDto, HourConfigResponseDto } from "../../../modules/subject";

export interface SubjectSummaryResponseControllerDto {
    id: number;
    name: string;
    subject_code: string;
    study_plan_year: number;
    associated_coordinator_name: string
    index: number;
    hour_configs?: HourConfigResponseDto[];
}

export class SubjectSummaryResponseControllerDtoHelper {
  // Method to convert Subject model instance to SubjectResponseDto
  public static fromModel(subject: SubjectResponseDto, associated_coordinator_name: string): SubjectSummaryResponseControllerDto {
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