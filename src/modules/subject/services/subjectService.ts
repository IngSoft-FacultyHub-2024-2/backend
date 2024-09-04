import subjectRepository from '../repositories/subjectRepository';
import Subject from '../repositories/models/Subject';
import { SubjectRequestDto, SubjectRequestDtoHelper } from '../dtos/request/subjectRequestDto';

export async function addSubject(subjectDto: SubjectRequestDto) {
  const subject: Partial<Subject> = SubjectRequestDtoHelper.toModel(subjectDto);
  const newSubject = await subjectRepository.addSubject(subject);
  return newSubject;
}

