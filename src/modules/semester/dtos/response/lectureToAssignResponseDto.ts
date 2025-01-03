import { SubjectRoles } from '../../../../shared/utils/enums/subjectRoles';

export interface lectureToAssignResponseDto {
  id: number;
  subject: string;
  subClasses: lectureRolesToAssignResponseDto[];
}

interface lectureRolesToAssignResponseDto {
  role: SubjectRoles;
  times: { [key: string]: number[] };
  num_teachers: number;
}
