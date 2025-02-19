export interface LectureResponseDto {
  id: number;
  subject: {
    id: number;
    name: string;
    acronym: string;
    valid: boolean;
    is_teo_tec_at_same_time: boolean;
    study_plan_year: number;
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
    is_technology_teacher: boolean;
    review: {
      approved: boolean;
      reason: string | null;
    } | null;
  }[];
  hour_configs: {
    id: number;
    day_of_week: string;
    modules: number[];
  }[];
  is_lecture_locked: boolean;
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
        is_teo_tec_at_same_time: lecture.subject.is_teo_tec_at_same_time,
        study_plan_year: lecture.subject.study_plan.year,
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
          is_technology_teacher: teacher.is_technology_teacher,
          review: teacher.review
            ? {
                approved: teacher.review === 'approved',
                reason: teacher.review !== 'approved' ? teacher.review : null,
              }
            : null,
        })),
        is_lecture_locked: role.is_lecture_locked,
        hour_configs: role.hour_configs.map((config: any) => ({
          id: config.id,
          day_of_week: config.day_of_week,
          modules: config.modules,
        })),
      })),
    };
  }
}
