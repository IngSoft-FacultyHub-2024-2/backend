// Import statements for Jest and the function to be tested
import { addTeacher } from '../../src/modules/teacher';
import teacherRepository from '../../src/modules/teacher/repositories/teacherRepository';

// Jest mock for teacherRepository
jest.mock('../../src/modules/teacher/repositories/teacherRepository', () => ({
  addTeacher: jest.fn(),
}));

describe('addTeacher', () => {
  it('calls addTeacher with the correct teacher data', async () => {
    // Arrange
    const mockTeacher = {
      name: "John",
      surname: 'Doe1',
    };

    (teacherRepository.addTeacher as jest.Mock).mockResolvedValue(mockTeacher);

    // Act
    const result = await addTeacher(mockTeacher);

    // Assert
    expect(teacherRepository.addTeacher).toHaveBeenCalledWith(mockTeacher);
    expect(result).toEqual(mockTeacher);
  });
});
