export interface LectureResponseDto {
  id: number;
  subject: {
    id: number;
    name: string;
    acronym: string;
    valid: boolean;
  };
  lecture_groups: LectureGroupResponseDto[];
  lecture_roles: LectureRoleResponseDto[];
}

export interface LectureGroupResponseDto {
  id: number;
  group: string;
  degree: {
    id: number;
    name: string;
  };
}

export interface LectureRoleResponseDto {
  id: number;
  role: string;
  teachers: {
    id: number;
    name: string;
    surname: string;
  }[];
  hour_configs: {
    id: number;
    day_of_week: string;
    modules: number[];
  }[];
}

export class LectureResponseDtoHelper {
  public static fromModel(lecture: any): LectureResponseDto {
    return {
      id: lecture.dataValues.id,
      subject: {
        id: lecture.subject.id,
        name: lecture.subject.name,
        acronym: lecture.subject.acronym,
        valid: lecture.subject.valid,
      },
      lecture_groups: lecture.lecture_groups.map((group: any) => ({
        group: group.group,
        degree: {
          id: group.degree.id,
          name: group.degree.name,
          acronym: group.degree.acronym,
        },
      })),
      lecture_roles: lecture.lecture_roles.map((role: any) => ({
        id: role.id,
        role: role.role,
        teachers: role.teachers.map((teacher: any) => ({
          id: teacher.id,
          name: teacher.name,
          surname: teacher.surname,
        })),
        hour_configs: role.hour_configs.map((config: any) => ({
          id: config.id,
          day_of_week: config.day_of_week,
          modules: config.modules,
        })),
      })),
    };
  }
}
