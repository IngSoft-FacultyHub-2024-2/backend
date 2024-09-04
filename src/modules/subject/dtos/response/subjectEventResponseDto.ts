import SubjectEvent from "../../repositories/models/SubjectEvent";

export interface SubjectEventResponseDto {
  subjectId: number;
  eventId: number;
  description: string;
}

export class SubjectEventResponseDtoHelper {
  public static fromModel(subjectEvent: SubjectEvent): SubjectEventResponseDto {
    return {
      subjectId: subjectEvent.subjectId,
      eventId: subjectEvent.eventId,
      description: subjectEvent.description,
    };
  }
}