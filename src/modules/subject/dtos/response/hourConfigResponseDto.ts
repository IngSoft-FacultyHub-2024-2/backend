import { SubjectRoles } from '../../../../shared/utils/enums/subjectRoles';
import HourConfig from "../../repositories/models/HourConfig";

export interface HourConfigResponseDto {
  id: number;
  subject_id: number;
  role: SubjectRoles.TECHNOLOGY | SubjectRoles.THEORY;
  total_hours: number;
}

export class HourConfigResponseDtoHelper {
  public static fromModel(hourConfig: HourConfig): HourConfigResponseDto {
    return {
      id: hourConfig.id,
      subject_id: hourConfig.subject_id,
      role: hourConfig.role,
      total_hours: hourConfig.total_hours,
    };
  }
}