import { translateWeekDayToEnglish } from '../../../shared/utils/enums/WeekDays';
import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';
import { getDegreeById } from '../../degree';
import { amountOfTeachersPerSubject, getSubjectById } from '../../subject';
import { getTeacherById } from '../../teacher';
import { LectureResponseDtoHelper } from '../dtos/response/lectureResponseDto';
import Lecture from '../repositories/models/Lecture';
import Semester from '../repositories/models/Semester';
import semesterRepository from '../repositories/semesterRepository';

export async function addSemester(semester: Partial<Semester>) {
  return await semesterRepository.addSemster(semester);
}

export async function deleteSemester(semesterId: number) {
  return await semesterRepository.deleteSemester(semesterId);
}

export async function updateSemester(
  semesterId: number,
  semester: Partial<Semester>
) {
  return await semesterRepository.updateSemester(semesterId, semester);
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
  return await semesterRepository.updateLecture(lectureId, lecture);
}

export async function getSemesterLecturesToAssign(semesterId: number) {
  const semester = await semesterRepository.getSemesterLectures(semesterId);
  if (!semester) {
    throw new ResourceNotFound('No se encontraron el semestre');
  }
  const amountOfTeachersPerSubjectDict = await amountOfTeachersPerSubject();

  const lectures = await Promise.all(
    semester.lectures.map(async (lecture: Lecture) => {
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
  role: string
) {
  return await semesterRepository.setTeacherToLecture(
    lectureId,
    teacherId,
    role
  );
}

export async function deleteTeachersAssignations(semesterId: number) {
  return await semesterRepository.deleteTeachersAssignations(semesterId);
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
