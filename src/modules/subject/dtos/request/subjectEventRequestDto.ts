import SubjectEvent from "../../repositories/models/SubjectEvent";

export interface SubjectEventRequestDto {
  eventId: number;
  description: string;
}

export class SubjectEventRequestDtoHelper {
  public static toModel(dto: SubjectEventRequestDto): Partial<SubjectEvent> {
    return {
    eventId: dto.eventId,
    description: dto.description,
    };
  }
}