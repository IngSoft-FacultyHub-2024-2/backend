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
      { model: HourConfig, as: 'hour_configs' }, 
      { model: Need, as: 'needs' },
      { model: SubjectEvent, as: 'events' }
    ],
    });
  }

  async addEventToSubject(subject_id: number, event_id: number, description: string) {
    return await SubjectEvent.create({ subject_id, event_id, description });
  }

  async getSubjects(filters?: Partial<Subject>, sortField?: string, sortOrder?: 'ASC' | 'DESC', page?: number, pageSize?: number) {
    if (!page || !pageSize) {
      return await Subject.findAll({ 
        where: filters, 
        include: [
          { model: HourConfig, as: 'hour_configs' }, 
          { model: Need, as: 'needs' },
          {
            model: SubjectEvent,
            as: 'events',
          },
        ],
      });
    }
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const orderOption = sortField ? [[sortField, sortOrder]] as Order : undefined;

    return await Subject.findAll({ 
      where: filters, 
      order: orderOption,
      limit,
      offset,
      include: [
        { model: HourConfig, as: 'hour_configs' }, 
        { model: Need, as: 'needs' },
        {
          model: SubjectEvent,
          as: 'events',
        },
      ],
    });
  }

  async getSubjectById(id: number) {
    return await Subject.findByPk(id, {
      include: [
        { model: HourConfig, as: 'hour_configs' }, 
        { model: Need, as: 'needs' },
        {
          model: SubjectEvent,
          as: 'events',
          include: [
            { model: Event, as: 'event' } // Include Event details through SubjectEvent
          ]
        },
      ],
    });
  }

  async countSubjects(filters?: Partial<Subject>) {
    return await Subject.count({ where: filters });
  }
}

export default new SubjectRepository;