import {
  addBenefit,
  deleteBenefit,
  getBenefits,
  updateBenefit,
} from '../../src/modules/teacher';
import benefitsRepository from '../../src/modules/teacher/repositories/benefitsRepository';

jest.mock('../../src/modules/teacher/repositories/models/Benefit');
jest.mock('../../src/modules/teacher/repositories/benefitsRepository');

describe('Benefit service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Test for getBenefits function
  describe('getBenefits', () => {
    it('should return a list of all benefits', async () => {
      const mockBenefits = [
        { id: 1, name: 'Health Insurance' },
        { id: 2, name: 'Pension Plan' },
      ];
      (benefitsRepository.getAllBenefits as jest.Mock).mockResolvedValue(
        mockBenefits
      );

      const result = await getBenefits();

      expect(benefitsRepository.getAllBenefits).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockBenefits);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to fetch benefits');
      (benefitsRepository.getAllBenefits as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(getBenefits()).rejects.toThrow(mockError);
      expect(benefitsRepository.getAllBenefits).toHaveBeenCalledTimes(1);
    });
  });

  describe('addBenefit', () => {
    it('should add a benefit successfully', async () => {
      const mockBenefit = { id: 1, name: 'Health Insurance' };
      (benefitsRepository.addBenefit as jest.Mock).mockResolvedValue(
        mockBenefit
      );

      const result = await addBenefit(mockBenefit);

      expect(benefitsRepository.addBenefit).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockBenefit);
    });

    it('should throw an error if repository fails', async () => {
      const mockBenefit = { id: 1, name: 'Health Insurance' };
      const mockError = new Error('Failed to add benefit');
      (benefitsRepository.addBenefit as jest.Mock).mockRejectedValue(mockError);

      await expect(addBenefit(mockBenefit)).rejects.toThrow(mockError);
      expect(benefitsRepository.addBenefit).toHaveBeenCalledTimes(1);
    });
  });
  describe('updateBenefit', () => {
    it('should update a benefit successfully', async () => {
      const mockBenefit = { id: 1, name: 'Health Insurance' };
      (benefitsRepository.updateBenefit as jest.Mock).mockResolvedValue(
        mockBenefit
      );

      const result = await updateBenefit(1, mockBenefit);

      expect(benefitsRepository.updateBenefit).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockBenefit);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to update benefit');
      (benefitsRepository.updateBenefit as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(
        updateBenefit(1, { name: 'Health Insurance' })
      ).rejects.toThrow(mockError);
      expect(benefitsRepository.updateBenefit).toHaveBeenCalledTimes(1);
    });
  });
  describe('deleteBenefit', () => {
    it('should delete a benefit successfully', async () => {
      const mockBenefit = { id: 1, name: 'Health Insurance' };
      (benefitsRepository.deleteBenefit as jest.Mock).mockResolvedValue(
        mockBenefit
      );

      const result = await deleteBenefit(1);

      expect(benefitsRepository.deleteBenefit).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockBenefit);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to delete benefit');
      (benefitsRepository.deleteBenefit as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(deleteBenefit(1)).rejects.toThrow(mockError);
      expect(benefitsRepository.deleteBenefit).toHaveBeenCalledTimes(1);
    });
  });
});
