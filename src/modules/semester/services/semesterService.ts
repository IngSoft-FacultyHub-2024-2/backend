import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';
import { getDegreeById } from '../../degree';
import { getSubjectById } from '../../subject';
import { getTeacherById } from '../../teacher';
import { LectureResponseDtoHelper } from '../dtos/out/lectureResponseDto';
import { SemesterResponseDtoHelper } from '../dtos/out/semesterResponseDto';
import Lecture from '../repositories/models/Lecture';
import Semester from '../repositories/models/Semester';
import semesterRepository from '../repositories/semesterRepository';

export async function addSemester(semester: Partial<Semester>) {
  return await semesterRepository.addSemster(semester);
}

export async function getSemesterLectures(
  semesterId: number,
  degreeId?: number,
  subjectId?: number,
  group?: string
) {
  const semester = await semesterRepository.getSemesterLectures(
    semesterId,
    degreeId,
    subjectId,
    group
  );
  if (!semester) {
    throw new ResourceNotFound('No se encontraron el semestre');
  }

  const lecturesPromises = semester.lectures.map(async (lecture) => {
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
        return teacherData;
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
  console.log(lecturesPromises);

  const lectures = await Promise.all(lecturesPromises);

  return SemesterResponseDtoHelper.fromModel(semester, lectures);
}

export async function addLecture(lecture: Partial<Lecture>) {
  //   console.log(lecture);
  return await semesterRepository.addLecture(lecture);
}
