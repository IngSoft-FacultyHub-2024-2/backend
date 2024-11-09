// tests/degreeService.test.ts

import degreeRepository from '../../src/modules/degree/repositories/degreeRepository';
import * as degreeService from '../../src/modules/degree/services/degreeService';

// Mock de las funciones del repositorio
jest.mock('../../src/modules/degree/repositories/degreeRepository');

describe('Degree Service', () => {
  const mockDegree = { id: 1, name: 'Computer Science', acronym: 'CS' };

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada test
  });

  describe('addDegree', () => {
    it('should call degreeRepository.addDegree with the correct parameters', async () => {
      (degreeRepository.addDegree as jest.Mock).mockResolvedValue(mockDegree);

      const result = await degreeService.addDegree('Computer Science', 'CS');

      expect(degreeRepository.addDegree).toHaveBeenCalledWith(
        'Computer Science',
        'CS'
      );
      expect(result).toEqual(mockDegree);
    });
  });

  describe('getDegrees', () => {
    it('should call degreeRepository.getDegrees and return all degrees', async () => {
      (degreeRepository.getDegrees as jest.Mock).mockResolvedValue([
        mockDegree,
      ]);

      const result = await degreeService.getDegrees();

      expect(degreeRepository.getDegrees).toHaveBeenCalled();
      expect(result).toEqual([mockDegree]);
    });
  });

  describe('getDegreeById', () => {
    it('should call degreeRepository.getDegreeById with the correct id and return the degree', async () => {
      (degreeRepository.getDegreeById as jest.Mock).mockResolvedValue(
        mockDegree
      );

      const result = await degreeService.getDegreeById(1);

      expect(degreeRepository.getDegreeById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDegree);
    });

    it('should return null if no degree is found with the given id', async () => {
      (degreeRepository.getDegreeById as jest.Mock).mockResolvedValue(null);

      const result = await degreeService.getDegreeById(999);

      expect(degreeRepository.getDegreeById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('getDegreeByAcronym', () => {
    it('should call degreeRepository.getDegreeByAcronym with the correct acronym and return the degree', async () => {
      (degreeRepository.getDegreeByAcronym as jest.Mock).mockResolvedValue(
        mockDegree
      );

      const result = await degreeService.getDegreeByAcronym('CS');

      expect(degreeRepository.getDegreeByAcronym).toHaveBeenCalledWith('CS');
      expect(result).toEqual(mockDegree);
    });

    it('should return null if no degree is found with the given acronym', async () => {
      (degreeRepository.getDegreeByAcronym as jest.Mock).mockResolvedValue(
        null
      );

      const result = await degreeService.getDegreeByAcronym('INVALID');

      expect(degreeRepository.getDegreeByAcronym).toHaveBeenCalledWith(
        'INVALID'
      );
      expect(result).toBeNull();
    });
  });
});
