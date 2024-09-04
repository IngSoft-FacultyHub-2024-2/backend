import { HourConfigResponseControllerDto, HourConfigResponseControllerDtoHelper } from './hourConfigResponseControllerDto';
import {SubjectResponseDto} from "../../../modules/subject";

export interface SubjectSummaryResponseControllerDto {
    id: number;
    name: string | null;
    subject_code: string | null;
    study_plan_year: number | null;
    associated_coordinator_name: string | null;
    index: number | null;
    hourConfigs?: HourConfigResponseControllerDto[];
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
          hourConfigs: subject.hourConfigs?.map((hc) => HourConfigResponseControllerDtoHelper.fromModel(hc)) || [],
      };
  }
}