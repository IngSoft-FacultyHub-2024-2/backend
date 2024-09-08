import HourConfig from "../../repositories/models/HourConfig";
import { TeacherRoles } from '../../../../shared/utils/teacherRoles';

export interface HourConfigResponseDto {
  id: number;
  subject_id: number;
  role: TeacherRoles.TECHNOLOGY | TeacherRoles.THEORY;
  total_hours: number;
  weekly_hours: number;
}

export class HourConfigResponseDtoHelper {
  public static fromModel(hourConfig: HourConfig): HourConfigResponseDto {
    return {
      id: hourConfig.id,
      subject_id: hourConfig.subject_id,
      role: hourConfig.role,
      total_hours: hourConfig.total_hours,
      weekly_hours: hourConfig.weekly_hours,
    };
  }
}