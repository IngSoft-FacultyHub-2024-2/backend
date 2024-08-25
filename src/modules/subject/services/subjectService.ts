import subjectRepository from '../repositories/subjectRepository';
import Subject from '../repositories/models/Subject';

class SubjectService {
  async addSubject(subject: Partial<Subject>) {
    return await subjectRepository.addSubject(subject);
  }
}

export default new SubjectService();