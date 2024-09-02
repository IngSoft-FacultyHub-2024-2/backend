import Subject from './models/Subject';
import HourConfig from './models/HourConfig';
import Need from './models/Need';
import SubjectEvent from './models/SubjectEvent';

class SubjectRepository {
  async addSubject(subject: Partial<Subject>) {
    return await Subject.create(subject, {
    include: [{ model: HourConfig, as: 'hourConfigs' }, { model: Need, as: 'needs' }],
    });
  }

  async addEventToSubject(subjectId: number, eventId: number, description: string) {
    return await SubjectEvent.create({ subjectId, eventId, description });
  }
}

export default new SubjectRepository;