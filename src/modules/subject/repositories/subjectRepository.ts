import Subject from './models/Subject';
import HourConfig from './models/HourConfig';
class SubjectRepository {
  async addSubject(subject: Partial<Subject>) {
    return await Subject.create(subject, {
    include: [{ model: HourConfig, as: 'hourConfigs' }],
  });
  }
}

export default new SubjectRepository;