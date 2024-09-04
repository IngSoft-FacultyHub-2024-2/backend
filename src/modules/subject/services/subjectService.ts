import subjectRepository from '../repositories/subjectRepository';
import Subject from '../repositories/models/Subject';
import { SubjectRequestDto, SubjectRequestDtoHelper } from '../dtos/request/subjectRequestDto';
import { SubjectResponseDtoHelper } from '../dtos/response/subjectResponseDto';

export async function addSubject(subjectDto: SubjectRequestDto) {
  const subject: Partial<Subject> = SubjectRequestDtoHelper.toModel(subjectDto);
  const newSubject = await subjectRepository.addSubject(subject);
  return SubjectResponseDtoHelper.fromModel(newSubject);
}

export async function getSubjects(filters?: Partial<Subject>, sortField?: string, sortOrder?: 'ASC' | 'DESC', page?: number, pageSize?: number) {
  const subjects: Subject[] = await subjectRepository.getSubjects(filters, sortField, sortOrder, page, pageSize);
  return subjects.map((subject) => SubjectResponseDtoHelper.fromModel(subject));
}

