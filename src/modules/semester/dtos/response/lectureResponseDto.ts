export interface LectureResponseDto {
  id: number;
  subject: {
    id: number;
    name: string;
  };
  lecture_groups: LectureGroup[];
  lecture_roles: LectureRole[];
}

interface LectureGroup {
  id: number;
  group: string;
  degree: {
    id: number;
    name: string;
  };
}

interface LectureRole {
  id: number;
  role: string;
  teachers: {
    id: number;
    name: string;
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
      },
      lecture_groups: lecture.lecture_groups.map((group: any) => ({
        id: group.id,
        group: group.group,
        degree: {
          id: group.degree.id,
          name: group.degree.name,
        },
      })),
      lecture_roles: lecture.lecture_roles.map((role: any) => ({
        id: role.id,
        role: role.role,
        teachers: role.teachers.map((teacher: any) => ({
          id: teacher.id,
          name: teacher.name,
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
