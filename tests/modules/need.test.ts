import {
  addNeed,
  deleteNeed,
  getNeedById,
  getNeeds,
  updateNeed,
} from '../../src/modules/subject';
import needRepository from '../../src/modules/subject/repositories/needRepository';

// Jest mock for needRepository
jest.mock('../../src/modules/subject/repositories/needRepository', () => ({
  getNeeds: jest.fn(),
  addNeed: jest.fn(),
  getNeedById: jest.fn(),
  updateNeed: jest.fn(),
  deleteNeed: jest.fn(),
}));

describe('Need Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNeeds', () => {
    it('retrieves needs successfully', async () => {
      const mockNeeds = [{ id: 1, name: 'whiteboard' }];
      (needRepository.getNeeds as jest.Mock).mockResolvedValue(mockNeeds);

      const result = await getNeeds();

      expect(needRepository.getNeeds).toHaveBeenCalled();
      expect(result).toEqual(mockNeeds);
    });

    it('retrieves needs with filters successfully', async () => {
      const filters = { name: 'whiteboard' };
      const mockFilteredNeeds = [{ id: 1, name: 'whiteboard' }];
      (needRepository.getNeeds as jest.Mock).mockResolvedValue(
        mockFilteredNeeds
      );

      const result = await getNeeds(filters);

      expect(needRepository.getNeeds).toHaveBeenCalledWith(
        filters,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockFilteredNeeds);
    });
  });

  describe('addNeed', () => {
    it('adds a need successfully', async () => {
      const mockNeed = { id: 1, name: 'whiteboard' };
      (needRepository.addNeed as jest.Mock).mockResolvedValue(mockNeed);

      const result = await addNeed(mockNeed);

      expect(needRepository.addNeed).toHaveBeenCalledWith(mockNeed);
      expect(result).toEqual(mockNeed);
    });
  });

  describe('getNeedById', () => {
    it('retrieves a need by ID successfully', async () => {
      const mockNeed = { id: 1, name: 'whiteboard' };
      (needRepository.getNeedById as jest.Mock).mockResolvedValue(mockNeed);

      const result = await getNeedById(1);

      expect(needRepository.getNeedById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNeed);
    });

    it('handles non-existent need gracefully', async () => {
      (needRepository.getNeedById as jest.Mock).mockResolvedValue(null);

      const result = await getNeedById(999);

      expect(needRepository.getNeedById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('updateNeed', () => {
    it('updates a need successfully', async () => {
      const updatedNeed = { id: 1, name: 'updated whiteboard' };
      (needRepository.updateNeed as jest.Mock).mockResolvedValue(updatedNeed);

      const result = await updateNeed(1, updatedNeed);

      expect(needRepository.updateNeed).toHaveBeenCalledWith(1, updatedNeed);
      expect(result).toEqual(updatedNeed);
    });
  });

  describe('deleteNeed', () => {
    it('deletes a need successfully', async () => {
      (needRepository.deleteNeed as jest.Mock).mockResolvedValue(undefined);

      await deleteNeed(1);

      expect(needRepository.deleteNeed).toHaveBeenCalledWith(1);
    });

    it('handles non-existent need deletion gracefully', async () => {
      (needRepository.deleteNeed as jest.Mock).mockResolvedValue(undefined);

      await deleteNeed(999);

      expect(needRepository.deleteNeed).toHaveBeenCalledWith(999);
    });
  });
});
