import { Op, Order, Transaction } from 'sequelize';
import sequelize from '../../../config/database';
import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';
import Event from './models/Event';
import HourConfig from './models/HourConfig';
import Need from './models/Need';
import StudyPlan from './models/StudyPlan';
import Subject from './models/Subject';
import SubjectEvent from './models/SubjectEvent';

type AmountOfTeachersPerRoleDict = {
  [role: string]: number;
};
type AmountOfTeachersPerSubjectDict = {
  [subjectId: number]: AmountOfTeachersPerRoleDict;
};

class SubjectRepository {
  async addSubject(subject: Partial<Subject>) {
    const studyPlan = await StudyPlan.findByPk(subject.study_plan_id);
    if (!studyPlan) {
      throw new ResourceNotFound(
        `No existe el Plan de estudios con id ${subject.study_plan_id}`
      );
    }
    subject.study_plan_year = studyPlan.year;
    const newSubject = await Subject.create(subject, {
      include: [
        { model: HourConfig, as: 'hour_configs' },
        { model: SubjectEvent, as: 'events' },
        { model: StudyPlan, as: 'study_plan' },
      ],
    });

    if (newSubject && subject.needs_ids && subject.needs_ids.length > 0) {
      await newSubject.setNeeds(subject.needs_ids);
    }
    const subjectWithNeeds = await newSubject.reload({
      include: [{ model: Need, as: 'needs' }],
    });
    return subjectWithNeeds;
  }

  async addEventToSubject(
    subject_id: number,
    event_id: number,
    description: string
  ) {
    return await SubjectEvent.create({ subject_id, event_id, description });
  }

  async getSubjects(
    limit: number,
    offset: number,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    withDeleted: boolean = false,
    search?: string,
    filters?: Partial<Subject>,
    sortField?: string
  ) {
    const orderOption = sortField
      ? ([[sortField, sortOrder]] as Order)
      : ([['study_plan_year', 'DESC']] as Order);

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
      distinct: true,
      paranoid: withDeleted,
      include: [
        { model: HourConfig, as: 'hour_configs' },
        { model: Need, as: 'needs' },
        { model: SubjectEvent, as: 'events' },
        { model: StudyPlan, as: 'study_plan' },
      ],
    });
  }

  async getSubjectById(id: number) {
    return await Subject.findByPk(id, {
      paranoid: false,
      include: [
        { model: HourConfig, as: 'hour_configs' },
        { model: Need, as: 'needs' },
        {
          model: SubjectEvent,
          as: 'events',
          include: [
            { model: Event, as: 'event' }, // Include Event details through SubjectEvent
          ],
        },
        { model: StudyPlan, as: 'study_plan' },
      ],
    });
  }

  async getAllSubjectNames() {
    return await Subject.findAll({
      where: { valid: true },
      attributes: [
        'id',
        'name',
        'acronym',
        'valid',
        'study_plan_year',
        'is_teo_tec_at_same_time',
      ],
      order: [['study_plan_year', 'DESC']],
    });
  }

  async updateSubject(id: number, subject: Partial<Subject>) {
    const studyPlan = await StudyPlan.findByPk(subject.study_plan_id);
    if (!studyPlan) {
      throw new ResourceNotFound(
        `No existe el Plan de estudios con id ${subject.study_plan_id}`
      );
    }
    subject.study_plan_year = studyPlan.year;
    const existingSubject = await Subject.findByPk(id, {
      paranoid: false,
      include: [{ model: HourConfig, as: 'hour_configs' }],
    });
    if (!existingSubject) {
      throw new ResourceNotFound(`No existe la materia con id ${id}`);
    }
    const transaction = await sequelize.transaction();
    try {
      // First, update or replace the hour_configs
      await this.updateHourConfigOfSubject(subject, id, transaction);

      // Update the subject itself (this will now pass validation because hour_configs are updated)
      await existingSubject.update(subject, { transaction });
      // Update the reminder associations
      await this.updateSubjectEventOfSubject(subject, id, transaction);

      await transaction.commit();

      return await this.getSubjectById(id);
    } catch (error) {
      console.log(error);
      // Rollback the transaction in case of any failure
      await transaction.rollback();
      throw error; // Re-throw the error to be handled elsewhere
    }
  }

  private async updateHourConfigOfSubject(
    subject: Partial<Subject>,
    subject_id: number,
    transaction: Transaction
  ) {
    if (subject.hour_configs) {
      // Remove old hour configs related to this subject
      await HourConfig.destroy({ where: { subject_id: subject_id } });
      // Create new hour configs
      const newHourConfigs = subject.hour_configs.map((hourConfig) => ({
        ...hourConfig,
        subject_id: subject_id,
      }));
      await HourConfig.bulkCreate(newHourConfigs);
    }
  }

  private async updateSubjectEventOfSubject(
    subject: Partial<Subject>,
    subject_id: number,
    transaction: Transaction
  ) {
    if (subject.events) {
      // Remove old events related to this subject
      await SubjectEvent.destroy({ where: { subject_id: subject_id } });
      // Create new events
      const newEvents = subject.events.map((event) => ({
        ...event,
        subject_id: subject_id,
      }));
      await SubjectEvent.bulkCreate(newEvents);
    }
  }

  async deleteSubject(id: number) {
    const subject = await Subject.findByPk(id, {
      include: [{ model: HourConfig, as: 'hour_configs' }],
    });

    if (!subject) {
      throw new ResourceNotFound(`No existe la materia con id ${id}`);
    }
    subject?.update({ valid: false });

    await subject.destroy();

    return subject;
  }

  async amountOfTeachersPerSubject(): Promise<AmountOfTeachersPerSubjectDict> {
    const subjects = await Subject.findAll({
      where: { valid: true },
      attributes: ['id', 'name', 'acronym', 'valid', 'study_plan_year'],
      include: [
        {
          model: HourConfig,
          as: 'hour_configs',
        },
      ],
    });

    return subjects.reduce((acc: AmountOfTeachersPerSubjectDict, subject) => {
      // Initialize an entry for the subject ID if not already present
      if (!acc[subject.id]) {
        acc[subject.id] = {};
      }

      subject.hour_configs.forEach((hourConfig) => {
        const role = hourConfig.role;
        // Increment the count for the role or initialize it to 1
        acc[subject.id][role] = (acc[subject.id][role] || 0) + 1;
      });

      return acc;
    }, {});
  }

  async getSubjectsIdsWithTecTeoAtSameTime(): Promise<number[]> {
    const subjects = await Subject.findAll({
      where: { is_teo_tec_at_same_time: true },
      attributes: ['id'],
    });

    return subjects.map((subject) => subject.id);
  }

  async getSubjectNamesByStudyPlan(studyPlanId: number) {
    return await Subject.findAll({
      attributes: [
        'id',
        'name',
        'acronym',
        'valid',
        'study_plan_year',
        'is_teo_tec_at_same_time',
      ],
      where: { study_plan_id: studyPlanId },
      order: [['name', 'ASC']],
    });
  }

  async updateSubjectVigencyByStudyPlan(
    studyPlanId: number,
    valid: boolean
  ): Promise<void> {
    const subjects = await Subject.findAll({
      where: { study_plan_id: studyPlanId },
      include: [
        {
          model: HourConfig,
          as: 'hour_configs',
        },
      ],
    });

    await Promise.all(subjects.map((subject) => subject.update({ valid })));
  }
}
export default new SubjectRepository();
