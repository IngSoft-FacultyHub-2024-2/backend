import subjectRepository from '../repositories/subjectRepository';
import Subject from '../repositories/models/Subject';
import { SubjectRequestDto, SubjectRequestDtoHelper } from '../dtos/request/subjectRequestDto';
import { SubjectResponseDtoHelper } from '../dtos/response/subjectResponseDto';
import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';

export async function addSubject(subjectDto: SubjectRequestDto) {
  const subject: Partial<Subject> = SubjectRequestDtoHelper.toModel(subjectDto);
  const newSubject = await subjectRepository.addSubject(subject);
  return SubjectResponseDtoHelper.fromModel(newSubject);
}

export async function getSubjects(filters?: Partial<Subject>, search?: string, sortField?: string, sortOrder?: 'ASC' | 'DESC', page: number = 1, pageSize: number = 10) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const subjectRows = await subjectRepository.getSubjects(sortOrder, limit, offset, search, filters, sortField);

  const totalPages = Math.ceil(subjectRows.count / pageSize);
  const subjects = subjectRows.rows;

  return { subjects, totalPages, currentPage: page };
  // return await subjectRepository.getSubjects(filters, search, sortField, sortOrder, page, pageSize);
}

export async function getSubjectById(id: number) {
  const subject = await subjectRepository.getSubjectById(id);
  if (!subject) {
    throw new ResourceNotFound(`Subject with ID ${id} not found`);
  }
  return SubjectResponseDtoHelper.fromModel(subject);
}

