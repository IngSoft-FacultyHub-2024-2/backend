import Teacher from "../repositories/models/Teacher";
import teacherRepository from "../repositories/teacherRepository";
import { ResourceNotFound } from "../../../shared/utils/exceptions/customExceptions";
import Benefit from "../repositories/models/Benefit";
import Category from "../repositories/models/Category";
import { TeacherResponseDto, TeacherResponseDtoHelper } from "../dtos/response/teacherResponseDto";
import { getSubjectById } from "../../subject";
import { TeacherSubjectHistoryResponseDto, TeacherSubjectHistoryResponseDtoHelper } from "../dtos/response/teacherSubjectHistoryResponseDto";
import { TeacherStates } from "../../../shared/utils/teacherStates";
import { teacherIsCoordinator } from "../../subject";

export async function addTeacher(teacher: Partial<Teacher>) {
  return await teacherRepository.addTeacher(teacher)
}

export async function getTeachers(
  search?: string, 
  state?: TeacherStates,
  sortField?: string,
  sortOrder: 'ASC' | 'DESC' = 'ASC',
  page: number = 1,
  pageSize: number = 10
) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const teacherRows = await teacherRepository.getTeachers( limit, offset, sortOrder, sortField, search, state);

  const totalPages = Math.ceil(teacherRows.count / pageSize);
  const teachers = teacherRows.rows;
  
  let teachersDto: TeacherResponseDto[] = []

  for (const teacher of teachers) {
    // add the associated subjects to the teacher
    let subjectsHistory: TeacherSubjectHistoryResponseDto[] = await Promise.all(teacher.subjects_history.map(async subjectsHistory => (TeacherSubjectHistoryResponseDtoHelper.fromModel(subjectsHistory, await getSubjectById(subjectsHistory.subject_id)))));
    teachersDto.push(TeacherResponseDtoHelper.fromModel(teacher, subjectsHistory))
  }

  return { "teachers": teachersDto, totalPages, currentPage: page };
}

export async function getTeacherById(id: number, includeOtherInfo: boolean = false) {
  let teacher = await teacherRepository.getTeacherById(id)
  if (!teacher) {
    throw new ResourceNotFound(`El docente con ID ${id} no existe`);
  }
  let teacherDto: TeacherResponseDto;
  if (includeOtherInfo) {
    let subjectsHistory: TeacherSubjectHistoryResponseDto[] = await Promise.all(teacher.subjects_history.map(async subjectsHistory => (TeacherSubjectHistoryResponseDtoHelper.fromModel(subjectsHistory, await getSubjectById(subjectsHistory.subject_id)))));
    teacherDto = TeacherResponseDtoHelper.fromModel(teacher, subjectsHistory)
  }
  else{
    teacherDto = TeacherResponseDtoHelper.fromModel(teacher)
  }
  return teacherDto;
}

export async function getAllTeachersNames() {
    const teacherNames = await teacherRepository.getAllTeachersNames();
    return teacherNames;
  }

export async function dismissTeacher(id: number) {
  const isCoordinator =  await teacherIsCoordinator(id);

  if (isCoordinator) {
    throw new Error('Este docente es coordinador de una materia y no puede ser dado de baja');
  }

  await teacherRepository.deleteTeacherSubjectGroups(id);

  return await teacherRepository.dismissTeacher(id);
}

export async function temporaryDismissTeacher(id: number, retentionDate: Date) {
  const isCoordinator =  await teacherIsCoordinator(id);

  if (isCoordinator) {
    throw new Error('Este docente es coordinador de una materia y no puede ser dado de baja');
  }

  await teacherRepository.deleteTeacherSubjectGroups(id);

  return await teacherRepository.temporaryDismissTeacher(id, retentionDate);
}

export async function getBenefits() {
  return await teacherRepository.getAllBenefits();
}

export async function getCategories() {
  return await teacherRepository.getAllCategories();
}