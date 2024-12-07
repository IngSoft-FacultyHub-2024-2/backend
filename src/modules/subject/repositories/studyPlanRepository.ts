import { Op, Order } from 'sequelize';
import StudyPlan from './models/StudyPlan';

class StudyPlanRepository {
  async addStudyPlan(studyPlan: Partial<StudyPlan>) {
    return await StudyPlan.create(studyPlan);
  }

  async getStudyPlans(
    filters?: Partial<StudyPlan>,
    search?: string,
    sortField?: string,
    sortOrder: 'ASC' | 'DESC' | undefined = 'ASC'
  ) {
    const orderOption = sortField
      ? ([[sortField, sortOrder]] as Order)
      : ([['year', 'DESC']] as Order);

    const searchQuery = search
      ? {
          [Op.or]: [{ year: { [Op.iLike]: `%${search}%` } }],
        }
      : {};

    const whereClause = {
      ...filters,
      ...searchQuery,
    };

    return await StudyPlan.findAll({
      where: whereClause,
      order: orderOption,
    });
  }

  async getStudyPlanById(id: number) {
    return await StudyPlan.findByPk(id);
  }

  async updateStudyPlan(id: number, studyPlan: Partial<StudyPlan>) {
    return await StudyPlan.update(studyPlan, {
      where: { id },
    });
  }

  async deleteStudyPlan(id: number) {
    return await StudyPlan.destroy({
      where: { id },
    });
  }
}

export default new StudyPlanRepository();
