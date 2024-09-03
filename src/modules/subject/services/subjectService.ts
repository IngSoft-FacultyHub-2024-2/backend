import subjectRepository from '../repositories/subjectRepository';
import Subject from '../repositories/models/Subject';
import { SubjectRequestDto, SubjectRequestDtoHelper } from '../dtos/request/subjectRequestDto';

export async function addSubject(subjectDto: SubjectRequestDto) {
  const subject: Partial<Subject> = SubjectRequestDtoHelper.toModel(subjectDto);
  const newSubject = await subjectRepository.addSubject(subject);
  return newSubject;
}

export async function getSubjects(filters?: Partial<Subject>, sortField?: string, sortOrder?: 'ASC' | 'DESC', page?: number, pageSize?: number) {
  return await subjectRepository.getSubjects(filters, sortField, sortOrder, page, pageSize);
}

