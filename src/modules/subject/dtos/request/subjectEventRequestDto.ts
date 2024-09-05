import SubjectEvent from "../../repositories/models/SubjectEvent";

export interface SubjectEventRequestDto {
  event_id: number;
  description: string;
}

export class SubjectEventRequestDtoHelper {
  public static toModel(dto: SubjectEventRequestDto): Partial<SubjectEvent> {
    return {
    event_id: dto.event_id,
    description: dto.description,
    };
  }
}