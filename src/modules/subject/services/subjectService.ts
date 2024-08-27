import subjectRepository from '../repositories/subjectRepository';
import Subject from '../repositories/models/Subject';

export async function addSubject(subject: Partial<Subject>) {
  return await subjectRepository.addSubject(subject);
}

