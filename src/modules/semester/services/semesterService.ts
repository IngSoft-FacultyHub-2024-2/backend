import { SubjectRoles } from '../../../shared/utils/enums/subjectRoles';
import {
  translateWeekDayToEnglish,
  weekDaysComparator,
} from '../../../shared/utils/enums/WeekDays';
import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';
import { getDegreeById, getDegrees } from '../../degree';
import {
  amountOfTeachersPerSubject,
  getSubjectById,
  SubjectResponseDto,
  getSubjectsIdsWithTecTeoAtSameTime,
} from '../../subject';
import { getTeacherById } from '../../teacher';
import { LectureResponseDtoHelper } from '../dtos/response/lectureResponseDto';
import { lectureToAssignResponseDto } from '../dtos/response/lectureToAssignResponseDto';
import Lecture from '../repositories/models/Lecture';
import LectureRole from '../repositories/models/LectureRole';
import Semester from '../repositories/models/Semester';
import semesterRepository from '../repositories/semesterRepository';
import fs from 'fs';
import Degree from '../../degree/repositories/models/Degree';
import { getModules, ModuleResponseDto } from '../../../modules/teacher';
import { getTimesOfModules } from '../../../shared/utils/modules';
import path from 'path';

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
  group?: string,
  teacherId?: number
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

  const existsTeacher = teacherId ? await getTeacherById(teacherId) : true;
  if (!existsTeacher) {
    throw new ResourceNotFound('No se encontró el profesor indicado');
  }

  const semester = await semesterRepository.getSemesterLectures(
    semesterId,
    degreeId,
    subjectId,
    group,
    teacherId
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

  const data: string[] = [];
  const degrees = await getDegrees();
  const modules = await getModules();
  console.log(degrees);
  for (let subject of subjects) {
    let hourlyLoad = subject.hour_configs?.reduce(
      (acc, config) => acc + config.total_hours,
      0
    );
    const subjectHeader = getSubjectHeader(subject);
    data.push(subjectHeader);
    data.push(`${hourlyLoad} horas docente`);
    const csvString = await Promise.all(
      semester.lectures
        .filter((lecture) => lecture.subject_id === subject.id)
        .map(async (lecture) => {
          return getLectureLine(lecture, subject, degrees, modules);
        })
    );

    data.push(...csvString);
    data.push('');
  }
  const filePath = await writeCsv(data);
  return filePath;
}

function getSubjectHeader(subject: SubjectResponseDto) {
  const teacherHeader = `"Teorico Nombre - Apellido Docente";"Número de Docente";"Horas asignadas al docente";"Días y Horario"`;
  const technologyTeacherHeader = `"Tecnology Nombre - Apellido Docente";"Número de Docente";"Horas asignadas al docente";"Días y Horario"`;
  const subjectHeaderPrefix = `"Nombre Materia";"Horas Materia";"Número Materia";"Grupo"`;
  subject.hour_configs?.sort((a, b) =>
    a.role === SubjectRoles.THEORY ? -1 : 1
  );
  let subjectHeader = subjectHeaderPrefix;
  if (!subject.hour_configs) {
    return subjectHeader;
  }
  for (let hourConfig of subject.hour_configs) {
    if (hourConfig.role === SubjectRoles.THEORY) {
      subjectHeader += ';' + teacherHeader;
    } else {
      subjectHeader += ';' + technologyTeacherHeader;
    }
  }
  return subjectHeader;
}

async function getLectureLine(
  lecture: Lecture,
  subject: SubjectResponseDto,
  degrees: Degree[],
  modules: ModuleResponseDto[]
) {
  let hoursStudentsHave = subject.frontal_hours;
  const lectureGroups = lecture.lecture_groups
    .map((lectureGroup) => {
      const degree = degrees.find(
        (degree) => degree.id === lectureGroup.degree_id
      );
      return `${lectureGroup.group} - ${degree?.acronym || ''}`;
    })
    .join(' ');
  let theoryRole = lecture.lecture_roles.find(
    (role) => role.role === SubjectRoles.THEORY
  );
  let technologyRole = lecture.lecture_roles.find(
    (role) => role.role === SubjectRoles.TECHNOLOGY
  );
  let amountOfTeachersShouldHaveTheory = subject.hour_configs
    ?.filter((hour_config) => hour_config.role === SubjectRoles.THEORY)
    .reduce((acc, config) => acc + 1, 0);
  let amountOfTeachersShouldHaveTechnology = subject.hour_configs
    ?.filter((hour_config) => hour_config.role === SubjectRoles.TECHNOLOGY)
    .reduce((acc, config) => acc + 1, 0);
  let theoryLectureLine = '';
  let technologyLectureLine = '';
  if (subject.is_teo_tec_at_same_time) {
    theoryLectureLine = await getRoleLectureLineIsTeoTecAtSameTime(
      theoryRole,
      subject,
      modules,
      amountOfTeachersShouldHaveTheory ?? 1,
      amountOfTeachersShouldHaveTechnology ?? 1,
      lectureGroups
    );
  } else {
    theoryLectureLine = await getRoleLectureLine(
      theoryRole,
      subject,
      modules,
      SubjectRoles.THEORY,
      amountOfTeachersShouldHaveTheory ?? 1,
      lectureGroups
    );
    technologyLectureLine = await getRoleLectureLine(
      technologyRole,
      subject,
      modules,
      SubjectRoles.TECHNOLOGY,
      amountOfTeachersShouldHaveTechnology ?? 1,
      lectureGroups
    );
  }
  const csvLine = `${subject.name}; ${hoursStudentsHave}; ${subject.subject_code}; ${lectureGroups}; ${theoryLectureLine} ${technologyLectureLine}`;
  return csvLine;
}

async function getRoleLectureLine(
  lectureRole: LectureRole | undefined,
  subject: SubjectResponseDto,
  modules: ModuleResponseDto[],
  roleType: SubjectRoles,
  amountOfTeachersShouldHave: number,
  lectureGroup: string
) {
  let data = '';
  let reminderTeachers = amountOfTeachersShouldHave;
  if (lectureRole?.teachers && lectureRole.teachers.length > 0) {
    const lectureClassTime = lectureRole?.hour_configs
      .sort((a, b) => weekDaysComparator(a.day_of_week, b.day_of_week))
      .map((config) => {
        const lectureModules = config.modules.map((module) => {
          return modules.find((m) => m.id === module);
        });
        if (!lectureModules) {
          throw Error('Lecture modules not found');
        }
        const filteredModules = lectureModules.filter(
          (module): module is ModuleResponseDto => module !== undefined
        );
        const lectureHours = getTimesOfModules(filteredModules);
        return `${config.day_of_week} ${lectureHours}`;
      })
      .join(', ');
    for (const lectureTeacher of lectureRole.teachers) {
      const teacher = await getTeacherById(lectureTeacher.teacher_id);
      const roleHours =
        subject.hour_configs?.find((config) => config.role === roleType)
          ?.total_hours ?? 0;
      data += `${teacher?.name} ${teacher?.surname}; ${teacher?.employee_number}; ${roleHours}; ${lectureClassTime};`;
      reminderTeachers--;
    }
  }
  if (reminderTeachers < 0) {
    throw Error(
      `Se assignaron mas profesores de los que se deberia a ${subject.name} ${roleType} ${lectureGroup}`
    );
  }
  if (reminderTeachers > 0) {
    for (let i = 0; i < reminderTeachers; i++) {
      data += `; ; ; ;`;
    }
  }
  return data;
}

async function getRoleLectureLineIsTeoTecAtSameTime(
  lectureRole: LectureRole | undefined,
  subject: SubjectResponseDto,
  modules: ModuleResponseDto[],
  amountOfTeachersShouldHaveTheory: number,
  amountOfTeachersShouldHaveTechnology: number,
  lectureGroup: string
) {
  let data = '';
  let reminderTeachersTheory = amountOfTeachersShouldHaveTheory;
  let reminderTeachersTechnology = amountOfTeachersShouldHaveTechnology;
  if (lectureRole?.teachers && lectureRole.teachers.length > 0) {
    const lectureClassTime = lectureRole?.hour_configs
      .sort((a, b) => weekDaysComparator(a.day_of_week, b.day_of_week))
      .map((config) => {
        const lectureModules = config.modules.map((module) => {
          return modules.find((m) => m.id === module);
        });
        if (!lectureModules) {
          throw Error('Lecture modules not found');
        }
        const filteredModules = lectureModules.filter(
          (module): module is ModuleResponseDto => module !== undefined
        );
        const lectureHours = getTimesOfModules(filteredModules);
        return `${config.day_of_week} ${lectureHours}`;
      })
      .join(', ');
    const theoryLectureTeachers = lectureRole.teachers.filter(
      (teacher) => !teacher.is_technology_teacher
    );
    const technologyLectureTeachers = lectureRole.teachers.filter(
      (teacher) => teacher.is_technology_teacher
    );
    for (const lectureTeacher of theoryLectureTeachers) {
      const teacher = await getTeacherById(lectureTeacher.teacher_id);
      const roleHoursTheory =
        subject.hour_configs?.find(
          (config) => config.role === SubjectRoles.THEORY
        )?.total_hours ?? 0;
      data += `${teacher?.name} ${teacher?.surname}; ${teacher?.employee_number}; ${roleHoursTheory}; ${lectureClassTime};`;
      reminderTeachersTheory--;
    }
    for (const lectureTeacher of technologyLectureTeachers) {
      const teacher = await getTeacherById(lectureTeacher.teacher_id);
      const roleHoursTechnology =
        subject.hour_configs?.find(
          (config) => config.role === SubjectRoles.TECHNOLOGY
        )?.total_hours ?? 0;
      data += `${teacher?.name} ${teacher?.surname}; ${teacher?.employee_number}; ${roleHoursTechnology}; ${lectureClassTime};`;
      reminderTeachersTechnology--;
    }
  }
  if (reminderTeachersTheory < 0 || reminderTeachersTechnology < 0) {
    throw Error(
      `Se assignaron mas profesores de los que se deberia a ${subject.name} ${lectureGroup}`
    );
  }
  if (reminderTeachersTheory > 0) {
    for (let i = 0; i < reminderTeachersTheory; i++) {
      data += `; ; ; ;`;
    }
  }

  if (reminderTeachersTechnology > 0) {
    for (let i = 0; i < reminderTeachersTechnology; i++) {
      data += `; ; ; ;`;
    }
  }
  return data;
}
async function writeCsv(data: string[]) {
  try {
    const date = new Date().toISOString().replace(/:/g, '-');
    // Write structured and raw CSV data
    const filePath = `./assignedTeachers-${date}.csv`;
    fs.writeFileSync(filePath, data.join('\n') + '\n', 'utf8');
    console.log('CSV file for assigned teachers created successfully');
    const absoluteFilePath = path.resolve(filePath);
    return absoluteFilePath;
  } catch (error) {
    console.error('Error generating CSV file for assigned teachers:', error);
  }
}
