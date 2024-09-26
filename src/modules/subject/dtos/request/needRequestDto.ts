import Need from "../../repositories/models/Need";

export interface NeedRequestDto {
  id?: number;
  name: string;
}

export class NeedRequestDtoHelper {
  public static toModel(dto: NeedRequestDto): Partial<Need> {
    return {
    id: dto.id,
    name: dto.name,
    };
  }
}