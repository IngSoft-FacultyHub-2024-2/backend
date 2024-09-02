import Need from "../../repositories/models/Need";

export interface NeedRequestDto {
  id?: number;
  subject_id?: number;
  name: string;
}

export class NeedRequestDtoHelper {
  public static toModel(dto: NeedRequestDto): Partial<Need> {
    return {
    id: dto.id,
    subject_id: dto.subject_id,
    name: dto.name,
    };
  }
}