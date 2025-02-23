import {
  addStudyPlan,
  deleteStudyPlan,
  getStudyPlans,
  updateStudyPlan,
} from '../../src/modules/subject';
import studyPlanRepository from '../../src/modules/subject/repositories/studyPlanRepository';

jest.mock('../../src/modules/subject/repositories/studyPlanRepository', () => ({
  getStudyPlans: jest.fn(),
  addStudyPlan: jest.fn(),
  updateStudyPlan: jest.fn(),
  deleteStudyPlan: jest.fn(),
}));
jest.mock('../../src/modules/subject/services/subjectService', () => ({
  updateSubjectVigencyByStudyPlan: jest.fn(),
}));

describe('StudyPlan Service', () => {
  describe('getStudyPlans', () => {
    it('retrieves all studyPlans successfully without filters', async () => {
      const mockStudyPlans = [
        { id: 1, year: 2024 },
        { id: 2, year: 2023 },
      ];
      (studyPlanRepository.getStudyPlans as jest.Mock).mockResolvedValue(
        mockStudyPlans
      );

      const result = await getStudyPlans();

      expect(studyPlanRepository.getStudyPlans).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockStudyPlans);
    });

    it('retrieves filtered studyPlans successfully', async () => {
      const filters = { year: 2024 };
      const mockFilteredStudyPlans = [{ id: 1, year: 2024 }];
      (studyPlanRepository.getStudyPlans as jest.Mock).mockResolvedValue(
        mockFilteredStudyPlans
      );

      const result = await getStudyPlans(filters);

      expect(studyPlanRepository.getStudyPlans).toHaveBeenCalledWith(
        filters,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockFilteredStudyPlans);
    });
  });

  describe('addStudyPlan', () => {
    it('adds a studyPlan successfully', async () => {
      const mockStudyPlan = { id: 1, year: 2024 };
      (studyPlanRepository.addStudyPlan as jest.Mock).mockResolvedValue(
        mockStudyPlan
      );

      const result = await addStudyPlan(mockStudyPlan);

      expect(studyPlanRepository.addStudyPlan).toHaveBeenCalledWith(
        mockStudyPlan
      );
      expect(result).toEqual(mockStudyPlan);
    });

    it('throws an error if addStudyPlan fails', async () => {
      const mockError = new Error('Failed to add studyPlan');
      (studyPlanRepository.addStudyPlan as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(addStudyPlan({ year: 2024 })).rejects.toThrow(
        'Failed to add studyPlan'
      );
    });
  });

  describe('updateStudyPlan', () => {
    it('updates a studyPlan successfully', async () => {
      const mockUpdatedStudyPlan = { id: 1, year: 2025 };
      (studyPlanRepository.updateStudyPlan as jest.Mock).mockResolvedValue(
        mockUpdatedStudyPlan
      );

      const result = await updateStudyPlan(1, { year: 2025 });

      expect(studyPlanRepository.updateStudyPlan).toHaveBeenCalledWith(1, {
        year: 2025,
      });
      expect(result).toEqual(mockUpdatedStudyPlan);
    });

    it('throws an error if updateStudyPlan fails', async () => {
      const mockError = new Error('Failed to update studyPlan');
      (studyPlanRepository.updateStudyPlan as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(updateStudyPlan(1, { year: 2025 })).rejects.toThrow(
        'Failed to update studyPlan'
      );
    });
  });

  describe('deleteStudyPlan', () => {
    it('deletes a studyPlan successfully', async () => {
      (studyPlanRepository.deleteStudyPlan as jest.Mock).mockResolvedValue(
        null
      );

      const result = await deleteStudyPlan(1);

      expect(studyPlanRepository.deleteStudyPlan).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });

    it('throws an error if deleteStudyPlan fails', async () => {
      const mockError = new Error('Failed to delete studyPlan');
      (studyPlanRepository.deleteStudyPlan as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(deleteStudyPlan(1)).rejects.toThrow(
        'Failed to delete studyPlan'
      );
    });
  });
});
