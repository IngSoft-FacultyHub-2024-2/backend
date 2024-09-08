// Import statements for Jest and the function to be tested
import { addTeacher, getTeacherById } from '../../src/modules/teacher';
import teacherRepository from '../../src/modules/teacher/repositories/teacherRepository';

// Jest mock for teacherRepository
jest.mock('../../src/modules/teacher/repositories/teacherRepository', () => ({
  addTeacher: jest.fn(), getTeacherById: jest.fn(),
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

describe('getTeacherById', () => {
  it('retrieves a teacher successfully by ID', async () => {
    // Arrange
    const mockTeacher = {
      id: 1,
      name: "John",
      surname: 'Doe',
    };
    const teacherId = 1;

    (teacherRepository.getTeacherById as jest.Mock).mockResolvedValue(mockTeacher);

    // Act
    const result = await getTeacherById(teacherId);

    // Assert
    expect(teacherRepository.getTeacherById).toHaveBeenCalledWith(teacherId);
    expect(result).toEqual(mockTeacher);
  });

  it('throws an error if teacher is not found', async () => {
    // Arrange
    const teacherId = 1;
    const mockError = new Error('Teacher not found');

    (teacherRepository.getTeacherById as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(getTeacherById(teacherId)).rejects.toThrow('Teacher not found');
    expect(teacherRepository.getTeacherById).toHaveBeenCalledWith(teacherId);
  });
});