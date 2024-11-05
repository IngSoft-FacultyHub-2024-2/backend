import Semester from '../../repositories/models/Semester';
import { LectureResponseDto } from './lectureResponseDto';

export interface SemesterResponseDto {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  lectures: LectureResponseDto[];
}

export class SemesterResponseDtoHelper {
  public static fromModel(
    semester: Semester,
    lectures: LectureResponseDto[]
  ): SemesterResponseDto {
    return {
      id: semester.id,
      name: semester.name,
      start_date: semester.start_date,
      end_date: semester.end_date,
      lectures: lectures,
    };
  }
}
