import Event from "../../repositories/models/Event";

export interface EventResponseDto {
  id: number;
  title: string;
}

export class EventResponseDtoHelper {
  public static fromModel(event: Event): EventResponseDto {
    return {
      id: event.id,
      title: event.title,
    };
  }
}