import subjectRepository from '../repositories/subjectRepository';
import Subject from '../repositories/models/Subject';
import { SubjectRequestDto, SubjectRequestDtoHelper } from '../dtos/request/subjectRequestDto';
import { SubjectResponseDto, SubjectResponseDtoHelper } from '../dtos/response/subjectResponseDto';
import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';
import { getTeacherRoles } from '../../../shared/utils/teacherRoles';
import { getTeacherById } from '../../teacher';

export async function addSubject(subjectDto: SubjectRequestDto) {
  const subject: Partial<Subject> = SubjectRequestDtoHelper.toModel(subjectDto);
  let coordinator = await getTeacherById(subjectDto.associated_coordinator);
  const newSubject = await subjectRepository.addSubject(subject);
  return SubjectResponseDtoHelper.fromModel(newSubject, coordinator);
}

export async function getSubjects(filters?: Partial<Subject>, search?: string, sortField?: string, sortOrder?: 'ASC' | 'DESC', page: number = 1, pageSize: number = 10) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const subjectRows = await subjectRepository.getSubjects(limit, offset, sortOrder, search, filters, sortField);

  const totalPages = Math.ceil(subjectRows.count / pageSize);
  const subjects = subjectRows.rows;

  let subjectsDto: SubjectResponseDto[] = []
  for (const subject of subjects) {
    let coordinator = await getTeacherById(subject.associated_coordinator);
    subjectsDto.push(SubjectResponseDtoHelper.fromModel(subject, coordinator));
  }

  return { "subjects": subjectsDto, totalPages, currentPage: page };
}

export async function getSubjectById(id: number, includeOtherInfo: boolean = false) {
  const subject = await subjectRepository.getSubjectById(id);
  if (!subject) {
    throw new ResourceNotFound(`Subject with ID ${id} not found`);
  }
  if (!includeOtherInfo) {
    return SubjectResponseDtoHelper.fromModel(subject);
  }
  let coordinator = await getTeacherById(subject.associated_coordinator);
  return SubjectResponseDtoHelper.fromModel(subject, coordinator);
}

export async function updateSubject(id: number, subjectDto: SubjectRequestDto) {
  const subject: Partial<Subject> = SubjectRequestDtoHelper.toModel(subjectDto);
  let coordinator = await getTeacherById(subjectDto.associated_coordinator);
  const updatedSubject = await subjectRepository.updateSubject(id, subject);
  if (!updatedSubject) {
    throw new ResourceNotFound(`Materia con id ${id} no existe, por lo cual no se puede actualizar`);
  }
  return SubjectResponseDtoHelper.fromModel(updatedSubject, coordinator);
}
