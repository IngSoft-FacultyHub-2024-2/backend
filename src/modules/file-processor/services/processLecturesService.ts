import { SubjectRoles } from '../../../shared/utils/enums/subjectRoles';
import { addLecture } from '../../semester';
import { getSubjects } from '../../subject';
import { getModules } from '../../teacher';
import { FileDataDto } from '../dtos/FileDataDto';

interface SemesterLectures {
  semester_id: number;
  subject_id: number;
  lecture_groups: {
    degree_id: number;
    group: string;
  }[];
  lecture_roles: {
    role: string;
    hour_configs: {
      day_of_week: string;
      modules: number[];
    }[];
  }[];
}

export async function processLectures(fileData: FileDataDto, data: string[]) {
  const result: SemesterLectures[] = [];
  let currentGroup = '';

  const { subjects: relevantSubjects } = await getSubjects(
    undefined,
    undefined,
    undefined,
    'ASC',
    1,
    1000,
    false
  );
  const modules = await getModules();
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  for (const row of data) {
    if (isGroupRow(row[0])) {
      currentGroup = row[0];
      continue;
    }

    if (currentGroup && isHourRow(row[0])) {
      const module = findModule(modules, row[0]);
      if (!module) continue;

      for (let j = 1; j <= days.length; j++) {
        const subject = normalizeString(row[j] || '').toUpperCase();
        const matchingSubject = relevantSubjects.find((subj) =>
          normalizeString(subject).includes(normalizeString(subj.name))
        );
        if (matchingSubject) {
          updateLecture(
            result,
            fileData,
            matchingSubject.id,
            currentGroup,
            days[j - 1],
            module.id,
            subject
          );
        }
      }
    }
  }

  // Guardar en la base de datos (descomentar para uso en producción)
  for (const lecture of result) {
    await addLecture(lecture as any);
  }

  return generateResultMessage(result, relevantSubjects);
}

function isGroupRow(value: any): boolean {
  return typeof value === 'string' && /^M\d{1,2}[A-Z]$/.test(value);
}

function isHourRow(value: any): boolean {
  return typeof value === 'string' && value.includes(':');
}

function findModule(modules: any[], hour: string) {
  return modules.find(
    (mod) => normalizeTimeString(mod.time) === normalizeTimeString(hour)
  );
}

function updateLecture(
  result: SemesterLectures[],
  fileData: FileDataDto,
  subjectId: number,
  group: string,
  day: string,
  moduleId: number,
  subject: string
) {
  const existingLecture = result.find(
    (res) =>
      res.semester_id === fileData.semesterId &&
      res.subject_id === subjectId &&
      res.lecture_groups.some(
        (groupData) =>
          groupData.degree_id === fileData.degreeId && groupData.group === group
      )
  );

  const role = subject.includes('TEC.')
    ? SubjectRoles.TECHNOLOGY
    : SubjectRoles.THEORY;

  if (existingLecture) {
    const lectureRole = existingLecture.lecture_roles.find(
      (r) => r.role === role
    );
    if (lectureRole) {
      addModuleToDay(lectureRole, day, moduleId);
    } else {
      existingLecture.lecture_roles.push(createHourConfig(role, day, moduleId));
    }
  } else {
    result.push(createLecture(fileData, subjectId, group, role, day, moduleId));
  }
}

function addModuleToDay(lectureRole: any, day: string, moduleId: number) {
  const dayConfig = lectureRole.hour_configs.find(
    (config: any) => config.day_of_week === day
  );
  if (dayConfig) {
    dayConfig.modules.push(moduleId);
  } else {
    lectureRole.hour_configs.push({ day_of_week: day, modules: [moduleId] });
  }
}

function createLecture(
  fileData: FileDataDto,
  subjectId: number,
  group: string,
  role: string,
  day: string,
  moduleId: number
): SemesterLectures {
  return {
    semester_id: fileData.semesterId!,
    subject_id: subjectId,
    lecture_groups: [{ degree_id: fileData.degreeId!, group }],
    lecture_roles: [createHourConfig(role, day, moduleId)],
  };
}

function createHourConfig(role: string, day: string, moduleId: number) {
  return {
    role,
    hour_configs: [{ day_of_week: day, modules: [moduleId] }],
  };
}

function generateResultMessage(result: SemesterLectures[], subjects: any[]) {
  let returnMessage = `Las siguientes materias se han procesado correctamente: \n`;
  subjects.forEach((subject) => {
    const subjectLectures = result.filter(
      (res) => res.subject_id === subject.id
    );
    returnMessage += `- Materia ${subject.name}: ${subjectLectures.length} dictados\n`;
  });
  console.log(returnMessage);
  return returnMessage;
}

function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

function normalizeTimeString(time: string): string {
  const cleanedTime = (time || '').replace(/\s+/g, '').replace(/[-.]/g, ':');
  const [startHour, startMinute, endHour, endMinute] = cleanedTime.split(':');
  return `${formatToHHMM(startHour, startMinute)} - ${formatToHHMM(endHour, endMinute)}`;
}

function formatToHHMM(hours: string = '00', minutes: string = '00'): string {
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}
