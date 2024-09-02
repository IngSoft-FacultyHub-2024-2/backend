import { HourConfigRequestDto, HourConfigRequestDtoHelper } from './hourConfigRequestDto';
import { NeedRequestDto, NeedRequestDtoHelper } from './needRequestDto';
import Subject from "../../repositories/models/Subject";
import Need from "../../repositories/models/Need";
import HourConfig from '../../repositories/models/HourConfig';

export interface SubjectRequestDto {
    id?: number;
    name: string | null;
    subject_code: string | null;
    study_plan_year: number | null;
    associated_teacher: number | null;
    associated_coordinator?: number | null;
    index: number | null;
    frontal_hours: number | null;
    intro_folder?: string | null;
    subject_folder?: string | null;
    technologies?: string | null;
    notes?: string | null;
    valid?: boolean;
    hourConfigs?: HourConfigRequestDto[];
    needs?: NeedRequestDto[];
}

export class SubjectRequestDtoHelper {
// Method to convert SubjectRequestDto to a Subject model instance
public static toModel(dto: SubjectRequestDto): Partial<Subject> {
    return {
    ...(dto.id !== undefined && { id: dto.id }),
    name: dto.name,
    subject_code: dto.subject_code,
    study_plan_year: dto.study_plan_year,
    associated_teacher: dto.associated_teacher,
    ...(dto.associated_coordinator !== undefined && { associated_coordinator: dto.associated_coordinator }),
    index: dto.index,
    frontal_hours: dto.frontal_hours,
    ...(dto.intro_folder !== undefined && { intro_folder: dto.intro_folder }),
    ...(dto.subject_folder !== undefined && { subject_folder: dto.subject_folder }),
    ...(dto.technologies !== undefined && { technologies: dto.technologies }),
    ...(dto.notes !== undefined && { notes: dto.notes }),
    ...(dto.valid !== undefined && { valid: dto.valid }),
    hourConfigs: dto.hourConfigs?.map((hc) => HourConfigRequestDtoHelper.toModel(hc) as HourConfig) || [] as HourConfig[],    
    needs: dto.needs?.map((n) => NeedRequestDtoHelper.toModel(n) as Need) || [] as Need[],
    };
  }
}
