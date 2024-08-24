import Subject from './models/Subject';

class SubjectRepository {
  async addSubject(subject: Partial<Subject>) {
    console.log("subject", subject)
    return await Subject.create(subject);
  }
}

export default new SubjectRepository;