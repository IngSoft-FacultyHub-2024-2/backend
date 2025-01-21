import { SubjectRoles } from '../../../shared/utils/enums/subjectRoles';
import {
  translateWeekDayToEnglish,
  WeekDays,
} from '../../../shared/utils/enums/WeekDays';
import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';
import { getDegreeById } from '../../degree';
import { getSubjectById, amountOfTeachersPerSubject } from '../../subject';
import { getTeacherById } from '../../teacher';
import { LectureResponseDtoHelper } from '../dtos/response/lectureResponseDto';
import { lectureToAssignResponseDto } from '../dtos/response/lectureToAssignResponseDto';
import Lecture from '../repositories/models/Lecture';
import LectureRole from '../repositories/models/LectureRole';
import Semester from '../repositories/models/Semester';
import semesterRepository from '../repositories/semesterRepository';
import { getSubjectsIdsWithTecTeoAtSameTime } from '../../subject';

export async function addSemester(semester: Partial<Semester>) {
  return await semesterRepository.addSemster(semester);
}

export async function getSemesters() {
  return await semesterRepository.getSemesters();
}

export async function getSemesterLectures(
  semesterId: number,
  degreeId?: number,
  subjectId?: number,
  group?: string
) {
  const existsDegree = degreeId ? await getDegreeById(degreeId) : true;
  if (!existsDegree) {
    throw new ResourceNotFound(
      'No se encontró la carrera por la que se filtró'
    );
  }

  const existsSubject = subjectId ? await getSubjectById(subjectId) : true;

  if (!existsSubject) {
    throw new ResourceNotFound(
      'No se encontró la materia por la que se filtró'
    );
  }

  const semester = await semesterRepository.getSemesterLectures(
    semesterId,
    degreeId,
    subjectId,
    group
  );
  if (!semester) {
    throw new ResourceNotFound('No se encontraron el semestre');
  }

  const lecturesPromises = semester.lectures.map(async (lecture: Lecture) => {
    const subject = await getSubjectById(lecture.subject_id);
    if (!subject) {
      throw new ResourceNotFound(
        'No se encontró la materia con id ' + lecture.subject_id
      );
    }

    const lectureGroupsPromises = lecture.lecture_groups.map(async (group) => {
      const degree = await getDegreeById(group.degree_id);
      if (!degree) {
        throw new ResourceNotFound(
          'No se encontró la carrera con id ' + group.degree_id
        );
      }
      return {
        ...group,
        group: group.group,
        degree,
      };
    });

    const lectureGroups = await Promise.all(lectureGroupsPromises);

    const lectureRolesPromises = lecture.lecture_roles.map(async (role) => {
      const teachersPromises = role.teachers.map(async (teacher) => {
        const teacherData = await getTeacherById(teacher.teacher_id);
        if (!teacherData) {
          throw new ResourceNotFound(
            'No se encontró el profesor con id ' + teacher.teacher_id
          );
        }
        return {
          ...teacherData,
          is_technology_teacher: teacher.is_technology_teacher,
        };
      });

      const teachers = await Promise.all(teachersPromises);
      return {
        ...role,
        role: role.role,
        teachers,
      };
    });

    const lectureRoles = await Promise.all(lectureRolesPromises);

    return LectureResponseDtoHelper.fromModel({
      ...lecture,
      subject,
      lecture_groups: lectureGroups,
      lecture_roles: lectureRoles,
    });
  });

  return await Promise.all(lecturesPromises);
}

export async function addLecture(lecture: Partial<Lecture>) {
  return await semesterRepository.addLecture(lecture);
}

export async function deleteLecture(lectureId: number) {
  return await semesterRepository.deleteLecture(lectureId);
}

export async function getSemesterLecturesGroups(
  semesterId: number,
  degreeId?: number
) {
  const existsDegree = degreeId ? await getDegreeById(degreeId) : true;
  if (!existsDegree) {
    throw new ResourceNotFound(
      'No se encontró la carrera por la que se filtró'
    );
  }

  const lecturesGroups = await semesterRepository.getSemesterLecturesGroups(
    semesterId,
    degreeId
  );
  return lecturesGroups;
}

export async function updateLecture(
  lectureId: number,
  lecture: Partial<Lecture>
) {
  const teachers = lecture.lecture_roles
    ? (
        await Promise.all(
          lecture.lecture_roles.map(async (role) => {
            const teachersPromises = role.teachers.map(async (teacher) => {
              const teacherData = await getTeacherById(
                teacher.teacher_id,
                true
              );
              if (!teacherData) {
                throw new ResourceNotFound(
                  'No se encontró el profesor con id ' + teacher.teacher_id
                );
              }
              return {
                ...teacherData,
                is_technology_teacher: teacher.is_technology_teacher,
              };
            });

            return await Promise.all(teachersPromises);
          })
        )
      ).flat()
    : [];
  return await semesterRepository.updateLecture(lectureId, lecture, teachers);
}

export async function getSemesterLecturesToAssign(
  semesterId: number
): Promise<lectureToAssignResponseDto[]> {
  const semester = await semesterRepository.getSemesterLectures(semesterId);
  if (!semester) {
    throw new ResourceNotFound('No se encontraron el semestre');
  }
  const amountOfTeachersPerSubjectDict = await amountOfTeachersPerSubject();
  const subjects_ids_teo_tec_at_same_time =
    await getSubjectsIdsWithTecTeoAtSameTime();

  const lecture_for_assignation = semester.lectures.map((lecture: Lecture) => {
    if (subjects_ids_teo_tec_at_same_time.includes(lecture.subject_id)) {
      const lectureRoleTheory = lecture.lecture_roles.filter(
        (role) => role.role === SubjectRoles.THEORY
      )[0];
      const lectureRoleTechnology = LectureRole.build({
        ...lectureRoleTheory,
        role: SubjectRoles.TECHNOLOGY,
      }).get({ plain: true });
      (lectureRoleTechnology.hour_configs =
        lecture.lecture_roles[0].hour_configs),
        (lectureRoleTechnology.teachers = lectureRoleTheory.teachers?.filter(
          (teacher: any) => teacher.is_technology_teacher
        ));
      lectureRoleTheory.teachers = lectureRoleTheory.teachers?.filter(
        (teacher: any) => !teacher.is_technology_teacher
      );
      lecture.lecture_roles.push(lectureRoleTechnology);
    }
    return lecture;
  });
  const lectures = await Promise.all(
    lecture_for_assignation.map(async (lecture: Lecture) => {
      const lectureRoles = await Promise.all(
        lecture.lecture_roles.map(async (lecture_role) => {
          const amountOfTeacherPerRoleOnSubject =
            amountOfTeachersPerSubjectDict[lecture.subject_id];

          // Check if the role exists in the subjectRoles
          if (
            !amountOfTeacherPerRoleOnSubject ||
            !(lecture_role.role in amountOfTeacherPerRoleOnSubject)
          ) {
            const subject = await getSubjectById(lecture.subject_id);
            throw new Error(
              `Role '${lecture_role.role}' no fue encontrado en la materia '${subject.name}' (ID: '${lecture.subject_id}')`
            );
          }

          return {
            role: lecture_role.role,
            times: lecture_role.hour_configs.reduce(
              (acc: { [key: string]: number[] }, lectureHourConfig) => {
                const day = translateWeekDayToEnglish(
                  lectureHourConfig.day_of_week
                );
                if (!acc[day]) {
                  acc[day] = [];
                }
                acc[day] = acc[day].concat(lectureHourConfig.modules);
                return acc;
              },
              {}
            ),
            num_teachers: amountOfTeacherPerRoleOnSubject[lecture_role.role],
          };
        })
      );

      return {
        id: lecture.id,
        subject: lecture.subject_id.toString(),
        subClasses: lectureRoles,
      };
    })
  );

  return lectures;
}

export async function setTeacherToLecture(
  lectureId: number,
  teacherId: number,
  role: string,
  is_technology_teacher: boolean
) {
  if (is_technology_teacher) {
    role = SubjectRoles.THEORY;
  }
  return await semesterRepository.setTeacherToLecture(
    lectureId,
    teacherId,
    role,
    is_technology_teacher
  );
}

export async function deleteTeachersAssignations(semesterId: number) {
  return await semesterRepository.deleteTeachersAssignations(semesterId);
}

export async function getPreassignedTeachers(semesterId: number) {
  const semesterLecture = await getSemesterLectures(semesterId);
  const preassigned = semesterLecture.reduce(
    (acc: { [lectureId: string]: { [role: string]: string[] } }, lecture) => {
      acc[lecture.id] = {};
      lecture.lecture_roles.forEach((role) => {
        if (role.is_lecture_locked) {
          acc[lecture.id][role.role] = role.teachers.map((teacher) =>
            teacher.id.toString()
          );
        }
      });
      return acc;
    },
    {}
  );
  return preassigned;
}

export async function getTeachersAssignedToLectures(semesterId: number) {
  const semesterLectures = await getSemesterLectures(semesterId);
  const assignedTeachers = semesterLectures.flatMap((lecture) =>
    lecture.lecture_roles.flatMap((role) => role.teachers)
  );
  return assignedTeachers;
}

export async function getLecturesWithTeachers(semesterId: number) {
  const semesterLectures = await getSemesterLectures(semesterId);
  semesterLectures.filter((lecture) =>
    lecture.lecture_roles.filter((role) => role.teachers.length > 0)
  );
  return semesterLectures;
}

export async function getLectureIdsOfSubjectsIdsWithTecTeoAtSameTime(
  semesterId: number
): Promise<number[]> {
  const semester = await semesterRepository.getSemesterLectures(semesterId);
  if (!semester) {
    throw new ResourceNotFound('No se encontraron el semestre');
  }
  const subjects_ids_tec_teo_at_same_time =
    await getSubjectsIdsWithTecTeoAtSameTime();
  const lectureIds = semester.lectures.filter((lecture) =>
    subjects_ids_tec_teo_at_same_time.includes(lecture.subject_id)
  );
  return lectureIds.map((lecture) => lecture.id);
}
