import { TeacherStates } from '../../../shared/utils/enums/teacherStates';
import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';
import { getSubjectById, teacherCoordinatorSubjects } from '../../subject';
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

export async function getTeachers(
  search?: string,
  state?: TeacherStates,
  risk?: number,
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
    risk
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

export async function getAllTeachersNames() {
  const teacherNames = await teacherRepository.getAllTeachersNames();
  return teacherNames;
}

export async function dismissTeacher(id: number) {
  const coordinatorSubjects = await teacherCoordinatorSubjects(id);

  if (coordinatorSubjects.length > 0) {
    throw new Error(
      'Este docente es coordinador de una materia y no puede ser dado de baja: ' +
        coordinatorSubjects.map((subject) => subject.name).join(', ')
    );
  }

  await teacherRepository.deleteTeacherSubjectGroups(id);

  await teacherRepository.dismissTeacher(id);
}

export async function temporaryDismissTeacher(id: number, retentionDate: Date) {
  const coordinatorSubjects = await teacherCoordinatorSubjects(id);

  if (coordinatorSubjects.length > 0) {
    throw new Error(
      'Este docente es coordinador de una materia y no puede ser dado de baja temporal: ' +
        coordinatorSubjects.map((subject) => subject.name).join(', ')
    );
  }

  await teacherRepository.deleteTeacherSubjectGroups(id);

  await teacherRepository.temporaryDismissTeacher(id, retentionDate);
}

export async function updateTeacher(id: number, teacher: Partial<Teacher>) {
  return await teacherRepository.updateTeacher(id, teacher);
}
