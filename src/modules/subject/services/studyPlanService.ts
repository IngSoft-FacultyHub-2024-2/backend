import StudyPlan from "../repositories/models/StudyPlan";
import studyPlanRepository from '../repositories/studyPlanRepository';

export async function addStudyPlan(event: Partial<StudyPlan>) {
    return await studyPlanRepository.addStudyPlan(event);
}

export async function getStudyPlans(filters?: Partial<StudyPlan>, search?: string, sortField?: string, sortOrder?: 'ASC' | 'DESC') {
    return await studyPlanRepository.getStudyPlans(filters, search, sortField, sortOrder);
}

export async function getStudyPlanById(id: number) {
    return await studyPlanRepository.getStudyPlanById(id);
}
