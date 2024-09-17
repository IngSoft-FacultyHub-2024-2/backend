import Subject from './models/Subject';
import HourConfig from './models/HourConfig';
import Need from './models/Need';
import SubjectEvent from './models/SubjectEvent';
import Event from './models/Event'; 
import { Op, Order } from 'sequelize';
import StudyPlan from './models/StudyPlan';

class SubjectRepository {
  async addSubject(subject: Partial<Subject>) {
    return await Subject.create(subject, {
    include: [
      { model: HourConfig, as: 'hour_configs' }, 
      { model: Need, as: 'needs' },
      { model: SubjectEvent, as: 'events' },
      { model: StudyPlan, as: 'study_plan' }
    ],
    });
  }

  async addEventToSubject(subject_id: number, event_id: number, description: string) {
    return await SubjectEvent.create({ subject_id, event_id, description });
  }

  async getSubjects(
    limit: number,
    offset: number,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    filters?: Partial<Subject>,
    sortField?: string
  ) {
      const orderOption = sortField ? [[sortField, sortOrder]] as Order : [['id', sortOrder]] as Order;
      const searchQuery = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { acronym: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
 
    // Combine filters and search query
    const whereClause = {
      ...filters,
      ...searchQuery,
    };
    
    return await Subject.findAndCountAll({ 
      where: whereClause, 
      order: orderOption,
      limit,
      offset,
      include: [
        { model: HourConfig, as: 'hour_configs' }, 
        { model: Need, as: 'needs' },
        { model: SubjectEvent, as: 'events' },
        { model: StudyPlan, as: 'study_plan' }
      ],
    });
  }

  async getSubjectById(id: number) {
    return await Subject.findByPk(id, {
      include: [
        { model: HourConfig, as: 'hour_configs' }, 
        { model: Need, as: 'needs' },
        {
          model: SubjectEvent, as: 'events',
          include: [
            { model: Event, as: 'event' } // Include Event details through SubjectEvent
          ]
        },
        { model: StudyPlan, as: 'study_plan' }
      ],
    });
  }
}

export default new SubjectRepository;