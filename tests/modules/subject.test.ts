// Import statements for Jest and the function to be tested
import { addSubject } from '../../src/modules/subject';
import subjectRepository from '../../src/modules/subject/repositories/subjectRepository';

// Jest mock for subjectRepository
jest.mock('../../src/modules/subject/repositories/subjectRepository', () => ({
  addSubject: jest.fn(),
}));

describe('addSubject', () => {
  it('calls addSubject with the correct subject', async () => {
    // Arrange
    const mockSubject = { name: 'Mathematics' };
    (subjectRepository.addSubject as jest.Mock).mockResolvedValue(mockSubject);

    // Act
    const result = await addSubject(mockSubject);

    // Assert
    expect(subjectRepository.addSubject).toHaveBeenCalledWith(mockSubject);
    expect(result).toEqual(mockSubject);
  });
});