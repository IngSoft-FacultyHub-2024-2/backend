import HourConfig from "../../repositories/models/HourConfig";
import { TeacherRoles } from '../../../../shared/utils/teacherRoles';

export interface HourConfigRequestDto {
  id?: number;
  subject_id?: number;
  role: TeacherRoles.TECHNOLOGY | TeacherRoles.THEORY;
  total_hours: number;
  weekly_hours: number;
}

export class HourConfigRequestDtoHelper {
  public static toModel(dto: HourConfigRequestDto): Partial<HourConfig> {
    return {
    id: dto.id,
    subject_id: dto.subject_id,
    role: dto.role,
    total_hours: dto.total_hours,
    weekly_hours: dto.weekly_hours,
    };
  }
}