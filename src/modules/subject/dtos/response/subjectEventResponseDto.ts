import SubjectEvent from "../../repositories/models/SubjectEvent";
import { EventResponseDto, EventResponseDtoHelper } from "./eventResponseDto";
import Event from "../../repositories/models/Event";

export interface SubjectEventResponseDto {
  subject_id: number;
  event_id: number;
  description: string;
  event?: EventResponseDto;
}

interface SubjectEventWithEvent extends SubjectEvent {
  event?: Event;
}

export class SubjectEventResponseDtoHelper {
  public static fromModel(subjectEvent: SubjectEventWithEvent): SubjectEventResponseDto {
    return {
      subject_id: subjectEvent.subject_id,
      event_id: subjectEvent.event_id,
      description: subjectEvent.description,
      ...(subjectEvent.event ? { event: EventResponseDtoHelper.fromModel(subjectEvent.event) } : {}),
    };
  }
}