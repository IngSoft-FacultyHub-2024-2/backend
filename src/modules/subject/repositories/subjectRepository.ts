import Subject from './models/Subject';
import HourConfig from './models/HourConfig';
import Need from './models/Need';
import SubjectEvent from './models/SubjectEvent';
import Event from './models/Event'; 
import { Op, Order } from 'sequelize';

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

  private getSearchQuery(search?: string) {
    return search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { acronym: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
  }

  async getSubjects(filters?: Partial<Subject>, search?: string, sortField?: string, sortOrder?: 'ASC' | 'DESC', page?: number, pageSize?: number) {
      const searchQuery = this.getSearchQuery(search);

    // Combine filters and search query
    const whereClause = {
      ...filters,
      ...searchQuery,
    };
    if (!page || !pageSize) {
      return await Subject.findAll({ 
        where: whereClause, 
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
      where: whereClause, 
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

  async countSubjects(filters?: Partial<Subject>, search?: string) {
    const searchQuery = this.getSearchQuery(search);

    // Combine filters and search query
    const whereClause = {
      ...filters,
      ...searchQuery,
    };
    return await Subject.count({ where: whereClause });
  }
}

export default new SubjectRepository;