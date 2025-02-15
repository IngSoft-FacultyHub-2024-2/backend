import { SubjectRoles } from '../../../shared/utils/enums/subjectRoles';
import { translateWeekDayToEnglish } from '../../../shared/utils/enums/WeekDays';
import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';
import { getDegreeById } from '../../degree';
import { amountOfTeachersPerSubject, getSubjectById } from '../../subject';
import { getTeacherById } from '../../teacher';
import { LectureResponseDtoHelper } from '../dtos/response/lectureResponseDto';
import { lectureToAssignResponseDto } from '../dtos/response/lectureToAssignResponseDto';
import Lecture from '../repositories/models/Lecture';
import LectureRole from '../repositories/models/LectureRole';
import Semester from '../repositories/models/Semester';
import semesterRepository from '../repositories/semesterRepository';
import { getSubjectsIdsWithTecTeoAtSameTime } from '../../subject';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';

interface LectureAssigned {
  nombreMateria: string;
  horasMateria: number | undefined;
  numeroMateria: string;
  grupo: string;
  /*nombreDocenteTeorico: string;
  numeroDocenteTeorico: number;
  horasAsignadasTeorico: number;
  diasHorarioTeorico: string;
  nombreDocenteTec1: string;
  numeroDocenteTec1: number;
  horasAsignadasTec1: number;
  diasHorarioTec1: string;
  nombreDocenteTec2: string;
  numeroDocenteTec2: number;
  horasAsignadasTec2: number;
  diasHorarioTec2: string;
  */
}

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

export async function getSemesterById(semesterId: number) {
  return await semesterRepository.getSemesterById(semesterId);
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
          acc[lecture.id][role.role] = role.teachers
            .filter((teacher) => !teacher.is_technology_teacher)
            .map((teacher) => teacher.id.toString());
          if (lecture.subject.is_teo_tec_at_same_time) {
            acc[lecture.id][SubjectRoles.TECHNOLOGY] = role.teachers
              .filter((teacher) => teacher.is_technology_teacher)
              .map((teacher) => teacher.id.toString());
          }
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

export async function getAssignedLecturesCsv(semesterId: number) {
  const semester = await semesterRepository.getSemesterLectures(semesterId);
  if (!semester) {
    throw new ResourceNotFound('No se encontraron el semestre');
  }
  const subjectIdsOfLectures = [
    ...new Set(semester.lectures.map((lecture) => lecture.subject_id)),
  ];
  const subjects = await Promise.all(
    subjectIdsOfLectures.map((subjectId) => getSubjectById(subjectId))
  );
  subjects.sort((a, b) => a.name.localeCompare(b.name));
  console.log('AC');
  const csvWriter = createObjectCsvWriter({
    path: 'output_Assigned.csv',
    header: [
      { id: 'nombreMateria', title: 'Nombre Materia' },
      { id: 'horasMateria', title: 'Horas Materia' },
      { id: 'numeroMateria', title: 'Número Materia' },
      { id: 'grupo', title: 'Grupo' },
      /*{ id: 'nombreDocenteTeorico', title: 'Nombre - Apellido Docente' },
      { id: 'numeroDocenteTeorico', title: 'Número de Docente' },
      { id: 'horasAsignadasTeorico', title: 'Horas asignadas al docente' },
      { id: 'diasHorarioTeorico', title: 'Días y Horario' },
      { id: 'nombreDocenteTec1', title: 'Nombre - Apellido Docente' },
      { id: 'numeroDocenteTec1', title: 'Número de Docente' },
      { id: 'horasAsignadasTec1', title: 'Horas asignadas al docente' },
      { id: 'diasHorarioTec1', title: 'Días y Horario' },
      { id: 'nombreDocenteTec2', title: 'Nombre - Apellido Docente' },
      { id: 'numeroDocenteTec2', title: 'Número de Docente' },
      { id: 'horasAsignadasTec2', title: 'Horas asignadas al docente' },
      { id: 'diasHorarioTec2', title: 'Días y Horario' },*/
    ],
  });

  const data: (LectureAssigned | string)[] = [];
  for (let subject of subjects) {
    let hourlyLoad = subject.hour_configs?.reduce(
      (acc, config) => acc + config.total_hours,
      0
    );
    data.push(`${hourlyLoad} horas docente`);
    const csvString = semester.lectures
      .filter((lecture) => lecture.subject_id === subject.id)
      .map((lecture) => {
        let theoryRole = lecture.lecture_roles.find(
          (role) => role.role === SubjectRoles.THEORY
        );
        let technologyRole = lecture.lecture_roles.find(
          (role) => role.role === SubjectRoles.TECHNOLOGY
        );
        let theoryLectureTeacher = theoryRole?.teachers[0];
        let theoryTeacher = null;
        if (theoryLectureTeacher) {
          theoryTeacher = getTeacherById(theoryLectureTeacher.teacher_id);
        }

        data.push({
          nombreMateria: subject.name,
          horasMateria: subject.hour_configs?.filter(
            (config) => config.role === SubjectRoles.THEORY
          )[0].total_hours,
          numeroMateria: subject.subject_code,
          // TODO: fix lectureGroup.degree_id do not show the id show the acronym
          grupo: lecture.lecture_groups.reduce(
            (acc, lectureGroup) =>
              `${acc} ${lectureGroup.group} - ${lectureGroup.degree_id}`,
            ''
          ),
          /*nombreDocenteTeorico: theoryTeacher ? `${theoryTeacher.} ${theoryTeacher.surname}` : '',
          numeroDocenteTeorico: theoryTeacher ? theoryTeacher.id : 0,
          horasAsignadasTeorico: theoryRole ? theoryRole.hour_configs.reduce((acc, config) => acc + config.modules.length, 0) : 0,
          diasHorarioTeorico: theoryRole ? theoryRole.hour_configs.map((config) => `${translateWeekDayToEnglish(config.day_of_week)} ${config.modules.join(':')}`).join(', ') : '',
          nombreDocenteTec1: technologyRole ? `${technologyRole.teachers[0].name} ${technologyRole.teachers[0].surname}` : '',
          numeroDocenteTec1: technologyRole ? technologyRole.teachers[0].id : 0,
          horasAsignadasTec1: technologyRole ? technologyRole.hour_configs.reduce((acc, config) => acc + config.modules.length, 0) : 0,
          diasHorarioTec1: technologyRole ? technologyRole.hour_configs.map((config) => `${translateWeekDayToEnglish(config.day_of_week)} ${config.modules.join(':')}`).join(', ') : '',
          nombreDocenteTec2: technologyRole && technologyRole.teachers.length > 1 ? `${technologyRole.teachers[1].name} ${technologyRole.teachers[1].surname}` : '',
          numeroDocenteTec2: technologyRole && technologyRole.teachers.length > 1 ? technologyRole.teachers[1].id : 0,
          horasAsignadasTec2: technologyRole && technologyRole.teachers.length > 1 ? technologyRole.hour_configs.reduce((acc, config) => acc + config.modules.length, 0) : 0,
          diasHorarioTec2: technologyRole && technologyRole.teachers.length > 1 ? technologyRole.hour_configs.map((config) => `${translateWeekDayToEnglish(config.day_of_week)} ${config.modules.join(':')}`).join(', ') : ''
          */
        });
      });
  }
  writeCsv(data);

  // for (let subject of subjects){
  //   const csvString = semester.lectures
  //     .filter((lecture) => lecture.subject_id === subject.id)
  //     .map((lecture) => {
  //       return lecture.lecture_roles
  //         .map((role) => {
  //           return role.teachers
  //             .map((teacher) => {
  //               return `${subject.name},${role.role},${teacher.name},${teacher.surname},${teacher.email}`;
  //             })
  //             .join('\n');
  //         })
  //         .join('\n');
  //     })
  //     .join('\n');
  // const filePath = path.join(__dirname, `../../../uploads/assigned_lectures_${semesterId}.csv

  // for (const lecture of semester.lectures) {
  //   const csvString = lecture.lecture_roles
  //     .map((role) => {
  //       return role.teachers
  //         .map((teacher) => {
  //           return `${lecture.subject.name},${role.role},${teacher.name},${teacher.surname},${teacher.email}`;
  //         })
  //         .join('\n');
  //     })
  //     .join('\n');
  // const filePath = path.join(__dirname, `../../../uploads/assigned_lectures_${semesterId}.csv
  //fs.writeFileSync(filePath, csvString, 'utf8');
}

async function writeCsv(data: (LectureAssigned | string)[]) {
  const stringLines: string[] = [];

  for (const item of data) {
    if (typeof item === 'string') {
      stringLines.push(item);
    } else {
      const csvLine = `"${item.nombreMateria}",${item.horasMateria},${item.numeroMateria},"${item.grupo}"`; //,"${item.nombreDocenteTeorico}",${item.numeroDocenteTeorico},${item.horasAsignadasTeorico},"${item.diasHorarioTeorico}","${item.nombreDocenteTec1}",${item.numeroDocenteTec1},${item.horasAsignadasTec1},"${item.diasHorarioTec1}","${item.nombreDocenteTec2}",${item.numeroDocenteTec2},${item.horasAsignadasTec2},"${item.diasHorarioTec2}"`;
      stringLines.push(csvLine);
    }
  }

  // Write header manually
  const header = `"Nombre Materia","Horas Materia","Número Materia","Grupo","Nombre - Apellido Docente","Número de Docente","Horas asignadas al docente","Días y Horario","Nombre - Apellido Docente","Número de Docente","Horas asignadas al docente","Días y Horario","Nombre - Apellido Docente","Número de Docente","Horas asignadas al docente","Días y Horario"\n`;
  console.log('ACA');
  // Write structured and raw CSV data
  fs.writeFileSync('output.csv', header + stringLines.join('\n') + '\n');
  console.log('CSV file created successfully');
}
