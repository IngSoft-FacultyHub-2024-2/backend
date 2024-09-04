import Subject from './models/Subject';
import HourConfig from './models/HourConfig';
import Need from './models/Need';
import SubjectEvent from './models/SubjectEvent';
import Event from './models/Event'; 
import { Order } from 'sequelize';

class SubjectRepository {
  async addSubject(subject: Partial<Subject>) {
    return await Subject.create(subject, {
    include: [
      { model: HourConfig, as: 'hourConfigs' }, 
      { model: Need, as: 'needs' },
      { model: SubjectEvent, as: 'events' }
    ],
    });
  }

  async addEventToSubject(subjectId: number, eventId: number, description: string) {
    return await SubjectEvent.create({ subjectId, eventId, description });
  }

  async getSubjects(filters?: Partial<Subject>, sortField?: string, sortOrder?: 'ASC' | 'DESC', page: number = 1, pageSize: number = 10) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const orderOption = sortField ? [[sortField, sortOrder]] as Order : undefined;

    return await Subject.findAll({ 
      where: filters, 
      order: orderOption,
      limit,
      offset,
      include: [
        { model: HourConfig, as: 'hourConfigs' }, 
        { model: Need, as: 'needs' },
        {
          model: SubjectEvent,
          as: 'events',
          /*include: [
            { model: Event, as: 'event' } // Include Event details through SubjectEvent
          ]*/
        }
      ],
    });
  }
}

export default new SubjectRepository;