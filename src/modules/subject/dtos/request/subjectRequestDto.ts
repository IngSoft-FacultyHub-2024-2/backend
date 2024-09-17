import { HourConfigRequestDto, HourConfigRequestDtoHelper } from './hourConfigRequestDto';
import { NeedRequestDto, NeedRequestDtoHelper } from './needRequestDto';
import Subject from "../../repositories/models/Subject";
import Need from "../../repositories/models/Need";
import HourConfig from '../../repositories/models/HourConfig';
import { SubjectEventRequestDto, SubjectEventRequestDtoHelper } from './subjectEventRequestDto';
import SubjectEvent from '../../repositories/models/SubjectEvent';

export interface SubjectRequestDto {
    id?: number;
    name: string;
    subject_code: string;
    acronym: string;
    study_plan_id: number;
    associated_coordinator: number;
    index: number;
    frontal_hours: number;
    intro_folder?: string | null;
    subject_folder?: string | null;
    technologies?: string | null;
    notes?: string | null;
    valid?: boolean;
    hour_configs?: HourConfigRequestDto[];
    needs?: NeedRequestDto[];
    needs_notes: string;
    events?: SubjectEventRequestDto[];
}

export class SubjectRequestDtoHelper {
// Method to convert SubjectRequestDto to a Subject model instance
public static toModel(dto: SubjectRequestDto): Partial<Subject> {
    return {
    ...(dto.id !== undefined && { id: dto.id }),
    name: dto.name,
    subject_code: dto.subject_code,
    acronym: dto.acronym,
    study_plan_id: dto.study_plan_id,
    associated_coordinator: dto.associated_coordinator,
    index: dto.index,
    frontal_hours: dto.frontal_hours,
    ...(dto.intro_folder !== undefined && { intro_folder: dto.intro_folder }),
    ...(dto.subject_folder !== undefined && { subject_folder: dto.subject_folder }),
    ...(dto.technologies !== undefined && { technologies: dto.technologies }),
    ...(dto.notes !== undefined && { notes: dto.notes }),
    ...(dto.valid !== undefined && { valid: dto.valid }),
    hour_configs: dto.hour_configs?.map((hc) => HourConfigRequestDtoHelper.toModel(hc) as HourConfig) || [] as HourConfig[],    
    needs: dto.needs?.map((n) => NeedRequestDtoHelper.toModel(n) as Need) || [] as Need[],
    needs_notes: dto.needs_notes,
    events: dto.events?.map((e) => SubjectEventRequestDtoHelper.toModel(e) as SubjectEvent)  || [] as SubjectEvent[],
    };
  }
}
