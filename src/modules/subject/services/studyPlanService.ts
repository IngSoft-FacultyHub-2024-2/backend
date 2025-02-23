import StudyPlan from '../repositories/models/StudyPlan';
import studyPlanRepository from '../repositories/studyPlanRepository';
import { updateSubjectVigencyByStudyPlan } from './subjectService';

export async function addStudyPlan(studyPlan: Partial<StudyPlan>) {
  return await studyPlanRepository.addStudyPlan(studyPlan);
}

export async function getStudyPlans(
  filters?: Partial<StudyPlan>,
  search?: string,
  sortField?: string,
  sortOrder?: 'ASC' | 'DESC'
) {
  return await studyPlanRepository.getStudyPlans(
    filters,
    search,
    sortField,
    sortOrder
  );
}

export async function getStudyPlanById(id: number) {
  return await studyPlanRepository.getStudyPlanById(id);
}

export async function updateStudyPlan(
  id: number,
  studyPlan: Partial<StudyPlan>
) {
  await updateSubjectVigencyByStudyPlan(id, studyPlan.valid!);
  return await studyPlanRepository.updateStudyPlan(id, studyPlan);
}

export async function deleteStudyPlan(id: number) {
  return await studyPlanRepository.deleteStudyPlan(id);
}
