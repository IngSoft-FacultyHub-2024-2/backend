import Need from "../../repositories/models/Need";

export interface NeedResponseDto {
  id: number;
  subject_id: number;
  name: string;
}

export class NeedResponseDtoHelper {
  public static fromModel(need: Need): NeedResponseDto {
    return {
      id: need.id,
      subject_id: need.subject_id,
      name: need.name,
    };
  }
}