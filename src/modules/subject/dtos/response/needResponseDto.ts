import Need from "../../repositories/models/Need";

export interface NeedResponseDto {
  id: number;
  name: string;
}

export class NeedResponseDtoHelper {
  public static fromModel(need: Need): NeedResponseDto {
    return {
      id: need.id,
      name: need.name,
    };
  }
}