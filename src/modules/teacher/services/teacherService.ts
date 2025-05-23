import fs from 'fs';
import path from 'path';
import { TeacherStates } from '../../../shared/utils/enums/teacherStates';
import { translateWeekDayToEnglish } from '../../../shared/utils/enums/WeekDays';
import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';
import { getSubjectById, teacherCoordinatorSubjects } from '../../subject';
import {
  getUserByTeacherId,
  subscribeUser,
  unsubscribeUser,
} from '../../userManagement';
import {
  TeacherResponseDto,
  TeacherResponseDtoHelper,
} from '../dtos/response/teacherResponseDto';
import {
  TeacherSubjectHistoryResponseDto,
  TeacherSubjectHistoryResponseDtoHelper,
} from '../dtos/response/teacherSubjectHistoryResponseDto';
import Teacher from '../repositories/models/Teacher';
import teacherRepository from '../repositories/teacherRepository';

export async function addTeacher(teacher: Partial<Teacher>) {
  return await teacherRepository.addTeacher(teacher);
}

export async function getTeachersContacts(
  search?: string,
  state?: TeacherStates,
  risk?: number,
  subject_id?: number
) {
  const teacherContacts = await teacherRepository.getTeachersContacts(
    search,
    state,
    risk,
    subject_id
  );

  return await generateContactsCsv(teacherContacts);
}

async function generateContactsCsv(teachers: Teacher[]) {
  try {
    const contacts = teachers
      .flatMap((teacher) => {
        if (teacher.contacts) {
          // Get all emails
          return teacher.contacts
            .filter((contact) => contact.mean === 'Mail')
            .map((contact) => contact.data);
        }
      })
      .filter((contact): contact is string => Boolean(contact));

    // Convertir los contactos en formato CSV
    const csvRows = ['Contactos'];
    contacts.forEach((contact) => {
      csvRows.push(contact); // Añadir cada contacto como una fila
    });

    const csvString = csvRows.join('\n');

    // Escribir el archivo CSV
    const date = new Date().toISOString().replace(/:/g, '-');
    const filePath = `./contacts-${date}.csv`;
    fs.writeFileSync(filePath, csvString, 'utf8');

    const absoluteFilePath = path.resolve(filePath);
    return absoluteFilePath;
  } catch (error) {
    console.error('Error generating contacts CSV file:', error);
  }
}

export async function getTeachers(
  search?: string,
  state?: TeacherStates,
  risk?: number,
  subject_id?: number,
  sortField?: string,
  sortOrder: 'ASC' | 'DESC' = 'ASC',
  page: number = 1,
  pageSize: number = 10,
  withDeleted?: boolean
) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const teacherRows = await teacherRepository.getTeachers(
    limit,
    offset,
    sortOrder,
    withDeleted,
    sortField,
    search,
    state,
    risk,
    subject_id
  );

  const totalPages = Math.ceil(teacherRows.count / pageSize);
  const teachers = teacherRows.rows;

  let teachersDto: TeacherResponseDto[] = [];

  for (const teacher of teachers) {
    // add the associated subjects to the teacher
    let subjectsHistory: TeacherSubjectHistoryResponseDto[] = await Promise.all(
      teacher.subjects_history.map(async (subjectsHistory) =>
        TeacherSubjectHistoryResponseDtoHelper.fromModel(
          subjectsHistory,
          await getSubjectById(subjectsHistory.subject_id)
        )
      )
    );
    teachersDto.push(
      TeacherResponseDtoHelper.fromModel(teacher, subjectsHistory)
    );
  }

  return { teachers: teachersDto, totalPages, currentPage: page };
}

export async function getTeacherById(
  id: number,
  includeOtherInfo: boolean = false
) {
  let teacher = await teacherRepository.getTeacherById(id);
  if (!teacher) {
    throw new ResourceNotFound(`El docente con ID ${id} no existe`);
  }
  let teacherDto: TeacherResponseDto;

  if (includeOtherInfo) {
    let subjectsHistory: TeacherSubjectHistoryResponseDto[] = await Promise.all(
      teacher.subjects_history.map(async (subjectsHistory) =>
        TeacherSubjectHistoryResponseDtoHelper.fromModel(
          subjectsHistory,
          await getSubjectById(subjectsHistory.subject_id)
        )
      )
    );
    teacherDto = TeacherResponseDtoHelper.fromModel(teacher, subjectsHistory);
  } else {
    teacherDto = TeacherResponseDtoHelper.fromModel(teacher);
  }
  return teacherDto;
}

export async function getTeacherOwnData(id: number) {
  let teacher = await teacherRepository.getTeacherById(id);
  if (!teacher) {
    throw new ResourceNotFound(`El docente con ID ${id} no existe`);
  }
  let teacherDto: TeacherResponseDto;

  let subjectsHistory: TeacherSubjectHistoryResponseDto[] = await Promise.all(
    teacher.subjects_history.map(async (subjectsHistory) =>
      TeacherSubjectHistoryResponseDtoHelper.fromModel(
        subjectsHistory,
        await getSubjectById(subjectsHistory.subject_id)
      )
    )
  );
  teacherDto = TeacherResponseDtoHelper.fromModel(teacher, subjectsHistory);
  return teacherDto;
}

export async function getAllTeachersNames() {
  const teacherNames = await teacherRepository.getAllTeachersNames();
  return teacherNames;
}

export async function dismissTeacher(id: number, motive: string) {
  const coordinatorSubjects = await teacherCoordinatorSubjects(id);

  if (coordinatorSubjects.length > 0) {
    throw new Error(
      'Este docente es coordinador de una materia y no puede ser dado de baja: ' +
        coordinatorSubjects.map((subject) => subject.name).join(', ')
    );
  }

  const date = new Date(Date.now()).toLocaleDateString('es-ES');
  const type = 'Dado de Baja';
  const structuredMotive = date + ' - ' + type + ' - ' + motive;

  await teacherRepository.deleteTeacherSubjectGroups(id);

  await teacherRepository.addDismissalMotive(id, structuredMotive);

  await teacherRepository.dismissTeacher(id);

  await teacherRepository.closeOpenSubjects(id);

  const user = await getUserByTeacherId(id);

  if (user) {
    await unsubscribeUser(user.id);
  }
}

export async function rehireTeacher(id: number) {
  await teacherRepository.rehireTeacher(id);

  const user = await getUserByTeacherId(id);

  if (user) {
    await subscribeUser(user.id);
  }
}

export async function temporaryDismissTeacher(
  id: number,
  retentionDate: Date,
  motive: string
) {
  const coordinatorSubjects = await teacherCoordinatorSubjects(id);

  if (coordinatorSubjects.length > 0) {
    throw new Error(
      'Este docente es coordinador de una materia y no puede ser dado de baja temporal: ' +
        coordinatorSubjects.map((subject) => subject.name).join(', ')
    );
  }

  const date = new Date(Date.now()).toLocaleDateString('es-ES');

  const type = `Dado de Baja Temporal (${retentionDate})`;
  const structuredMotive = date + ' - ' + type + ' - ' + motive;

  await teacherRepository.deleteTeacherSubjectGroups(id);

  await teacherRepository.addDismissalMotive(id, structuredMotive);

  await teacherRepository.temporaryDismissTeacher(id, retentionDate);

  await teacherRepository.closeOpenSubjects(id);

  const user = await getUserByTeacherId(id);

  if (user) {
    await unsubscribeUser(user.id);
  }
}

export async function getTeachersToAssignLectures() {
  const teachers = await teacherRepository.getTeachersToAssignLectures();
  const teachersToAssign = await Promise.all(
    teachers
      .filter((teacher: Teacher) => teacher.subjects_history.length > 0)
      .map(async (teacher: Teacher) => {
        const seniority = await teacher.getSeniorityInSemesters();

        const availableTimes: { [key: string]: number[] } =
          teacher.teacher_available_modules.reduce(
            (acc: { [key: string]: number[] }, module) => {
              const day = translateWeekDayToEnglish(module.day_of_week);
              if (!acc[day]) {
                acc[day] = [];
              }
              acc[day].push(module.module_id);
              return acc;
            },
            {}
          );

        const groups: {
          my_role: string[];
          subject: string;
          other_teacher: { teacher: string; role: string[] }[];
        }[] = teacher.teacher_subject_groups.map((group) => ({
          my_role: [
            group.members.filter(
              (member) => member.teacher_id === teacher.id
            )[0].role,
          ],
          subject: group.subject_id.toString(),
          other_teacher: group.members
            .filter((member) => member.teacher_id !== teacher.id)
            .map((member) => ({
              teacher: member.teacher_id.toString(),
              role: [member.role],
            })),
        }));

        const subjectHeKnowHowToTeach = getSubjectHeKnowHowToTeach(teacher);

        return {
          id: teacher.id,
          name: teacher.name,
          surname: teacher.surname,
          seniority,
          subject_he_know_how_to_teach: subjectHeKnowHowToTeach,
          available_times: availableTimes,
          weekly_hours_max_work: 80, // TODO: Cambiar por el valor real
          groups,
        };
      })
  );
  return teachersToAssign;
}

function getSubjectHeKnowHowToTeach(teacher: Teacher) {
  return teacher.subjects_history.map((history) => ({
    subject: history.subject_id.toString(),
    role: [history.role],
  }));
}

export async function updateTeacher(id: number, teacher: Partial<Teacher>) {
  return await teacherRepository.updateTeacher(id, teacher);
}
