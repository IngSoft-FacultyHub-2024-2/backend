import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../../src/modules/teacher';
import categoryRepository from '../../src/modules/teacher/repositories/categoryRepository';

jest.mock('../../src/modules/teacher/repositories/models/Category');
jest.mock('../../src/modules/teacher/repositories/categoryRepository');

describe('Categories Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for getCategories function
  describe('getCategories', () => {
    it('should return a list of all categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Full Professor' },
        { id: 2, name: 'Assistant Professor' },
      ];
      (categoryRepository.getAllCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const result = await getCategories();

      expect(categoryRepository.getAllCategories).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCategories);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to fetch categories');
      (categoryRepository.getAllCategories as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(getCategories()).rejects.toThrow(
        'Failed to fetch categories'
      );
      expect(categoryRepository.getAllCategories).toHaveBeenCalledTimes(1);
    });
  });

  describe('addCategory', () => {
    it('should add a category successfully', async () => {
      const mockCategory = { id: 1, name: 'Full Professor' };
      (categoryRepository.addCategory as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const result = await addCategory(mockCategory);

      expect(categoryRepository.addCategory).toHaveBeenCalledWith(mockCategory);
      expect(result).toEqual(mockCategory);
    });

    it('should throw an error if repository fails', async () => {
      const mockCategory = { id: 1, name: 'Full Professor' };
      const mockError = new Error('Failed to add category');
      (categoryRepository.addCategory as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(addCategory(mockCategory)).rejects.toThrow(mockError);
      expect(categoryRepository.addCategory).toHaveBeenCalledTimes(1);
    });
  });
  describe('updateCategory', () => {
    it('should update a category successfully', async () => {
      const mockCategory = { id: 1, name: 'Full Professor' };
      (categoryRepository.updateCategory as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const result = await updateCategory(1, mockCategory);

      expect(categoryRepository.updateCategory).toHaveBeenCalledWith(
        1,
        mockCategory
      );
      expect(result).toEqual(mockCategory);
    });

    it('should throw an error if repository fails', async () => {
      const mockCategory = { id: 1, name: 'Full Professor' };
      const mockError = new Error('Failed to update category');
      (categoryRepository.updateCategory as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(updateCategory(1, mockCategory)).rejects.toThrow(mockError);
      expect(categoryRepository.updateCategory).toHaveBeenCalledTimes(1);
    });
  });
  describe('deleteCategory', () => {
    it('should delete a category successfully', async () => {
      (categoryRepository.deleteCategory as jest.Mock).mockResolvedValue(null);

      await deleteCategory(1);

      expect(categoryRepository.deleteCategory).toHaveBeenCalledWith(1);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to delete category');
      (categoryRepository.deleteCategory as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(deleteCategory(1)).rejects.toThrow(mockError);
      expect(categoryRepository.deleteCategory).toHaveBeenCalledTimes(1);
    });
  });
});
