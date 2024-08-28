import Subject from './models/Subject';
import HourConfig from './models/HourConfig';
import Need from './models/Need';

class SubjectRepository {
  async addSubject(subject: Partial<Subject>) {
    return await Subject.create(subject, {
    include: [{ model: HourConfig, as: 'hourConfigs' }, { model: Need, as: 'needs' }],
  });
  }
}

export default new SubjectRepository;