import { SubjectRoles } from '../../../../shared/utils/enums/subjectRoles';
import HourConfig from '../../repositories/models/HourConfig';

export interface HourConfigRequestDto {
  id?: number;
  subject_id?: number;
  role: SubjectRoles.TECHNOLOGY | SubjectRoles.THEORY;
  total_hours: number;
}

export class HourConfigRequestDtoHelper {
  public static toModel(dto: HourConfigRequestDto): Partial<HourConfig> {
    return {
      id: dto.id,
      subject_id: dto.subject_id,
      role: dto.role,
      total_hours: dto.total_hours,
    };
  }
}
