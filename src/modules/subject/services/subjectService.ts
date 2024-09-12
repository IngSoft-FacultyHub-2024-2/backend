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

export async function getSubjects(filters?: Partial<Subject>, search?: string, sortField?: string, sortOrder?: 'ASC' | 'DESC', page?: number, pageSize?: number) {
  const subjects: Subject[] = await subjectRepository.getSubjects(filters, search, sortField, sortOrder, page, pageSize);
  return subjects.map((subject) => SubjectResponseDtoHelper.fromModel(subject));
}

export async function getSubjectById(id: number) {
  const subject = await subjectRepository.getSubjectById(id);
  if (!subject) {
    throw new ResourceNotFound(`Subject with ID ${id} not found`);
  }
  return SubjectResponseDtoHelper.fromModel(subject);
}

export async function countSubjects(filters?: Partial<Subject>) {
  return subjectRepository.countSubjects(filters);
}

