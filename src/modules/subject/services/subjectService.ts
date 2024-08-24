import subjectRepository from '../repositories/subjectRepository';

class SubjectService {
  async addSubject(subject: any) {
    // TODO: remove the any type from subject in the parameter
    // TODO: Add validation
    console.log("acc validatioon");
    return await subjectRepository.addSubject(subject);
  }
}

export default new SubjectService();