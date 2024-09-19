import { addTeacher, getTeachers, getTeacherById, getBenefits, getCategories, getAllTeachersNames } from '../../src/modules/teacher/services/teacherService';
import teacherRepository from '../../src/modules/teacher/repositories/teacherRepository';
import Benefit from '../../src/modules/teacher/repositories/models/Benefit';
import Category from '../../src/modules/teacher/repositories/models/Category';
import { ResourceNotFound } from '../../src/shared/utils/exceptions/customExceptions';
import { getSubjectById } from '../../src/modules/subject';

// Mocking the necessary modules
jest.mock('../../src/modules/teacher/repositories/teacherRepository');
jest.mock('../../src/modules/teacher/repositories/models/Benefit');
jest.mock('../../src/modules/teacher/repositories/models/Category');
jest.mock('../../src/modules/subject/', () => ({
  getSubjectById: jest.fn(),
}));

const removeUndefinedAndEmptyArrays = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.filter(value => value !== undefined && !(Array.isArray(value) && value.length === 0))
              .map(removeUndefinedAndEmptyArrays);
  }
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value !== undefined && !(Array.isArray(value) && value.length === 0))
      .map(([key, value]) => [key, removeUndefinedAndEmptyArrays(value)])
  );
};

describe('Teacher Service', () => {

  // Test for addTeacher function
  describe('addTeacher', () => {
    it('should call addTeacher with the correct teacher data and return the result', async () => {
      const mockTeacher = { name: "John", surname: 'Doe1' };

      (teacherRepository.addTeacher as jest.Mock).mockResolvedValue(mockTeacher);

      const result = await addTeacher(mockTeacher);

      expect(teacherRepository.addTeacher).toHaveBeenCalledWith(mockTeacher);
      expect(result).toEqual(mockTeacher);
    });

    it('should throw an error if repository fails', async () => {
      const mockTeacher = { name: "John", surname: 'Doe1' };
      const mockError = new Error('Failed to add teacher');

      (teacherRepository.addTeacher as jest.Mock).mockRejectedValue(mockError);

      await expect(addTeacher(mockTeacher)).rejects.toThrow('Failed to add teacher');
      expect(teacherRepository.addTeacher).toHaveBeenCalledWith(mockTeacher);
    });
  });

  // Test for getTeachers function
  describe('getTeachers', () => {
    it('should return a paginated list of teachers with subject history', async () => {
      // Arrange
      const mockTeachers = {
        rows: [
          { id: 1, name: "John", surname: 'Doe', subjects_history: [{ subject_id: 1 }] },
          { id: 2, name: "Jane", surname: 'Smith', subjects_history: [{ subject_id: 2 }] }
        ],
        count: 2
      };
      
      const mockSubjects = [
        { id: 1, name: "Mathematics" },
        { id: 2, name: "Physics" }
      ];
  
      const mockTeacherDto = [
        { id: 1, name: "John", surname: "Doe", subjects_history: [{subject_id: 1 , subject: { id: 1, name: 'Mathematics' }}] },
        { id: 2, name: "Jane", surname: "Smith", subjects_history: [{subject_id: 2, subject:{ id: 2, name: 'Physics' }}] }
      ];
  
      (teacherRepository.getTeachers as jest.Mock).mockResolvedValue(mockTeachers);
      (getSubjectById as jest.Mock).mockImplementation((id) => {
        return mockSubjects.find(subject => subject.id === id);
      });
  
      // Act
      const result = await getTeachers();
  
      // Assert
      expect(teacherRepository.getTeachers).toHaveBeenCalledWith(10, 0, undefined, undefined, undefined, undefined);
      expect(getSubjectById).toHaveBeenCalledTimes(2); // Once for each teacher's subjects_history
      expect(result.teachers.map(removeUndefinedAndEmptyArrays)).toEqual(mockTeacherDto);
      expect(result.totalPages).toEqual(1);
      expect(result.currentPage).toEqual(1);
    });

    it('should handle empty search results', async () => {
      const mockTeachers = { rows: [], count: 0 };

      (teacherRepository.getTeachers as jest.Mock).mockResolvedValue(mockTeachers);

      const result = await getTeachers({}, 'NonExistentTeacher', 'name', 'ASC', 1, 10);

      expect(result.teachers).toEqual([]);
      expect(result.totalPages).toEqual(0);
      expect(result.currentPage).toEqual(1);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to fetch teachers');

      (teacherRepository.getTeachers as jest.Mock).mockRejectedValue(mockError);

      await expect(getTeachers({}, 'NonExistentTeacher', 'name', 'ASC', 1, 10)).rejects.toThrow('Failed to fetch teachers');
      expect(teacherRepository.getTeachers).toHaveBeenCalledWith(10, 0, 'ASC', 'NonExistentTeacher', {}, 'name');
    });
  });

  // Test for getTeacherById function
  describe('getTeacherById', () => {
    it('should retrieve a teacher by ID if exists', async () => {
      const mockTeacher = { id: 1, name: "John", surname: 'Doe' };

      (teacherRepository.getTeacherById as jest.Mock).mockResolvedValue(mockTeacher);

      const result = await getTeacherById(1);

      expect(teacherRepository.getTeacherById).toHaveBeenCalledWith(1);
      expect(removeUndefinedAndEmptyArrays(result)).toEqual({...mockTeacher, subjects_history: null});
    });

    it('should return teacher DTO with subjects info if includeOtherInfo is true', async () => {
      // Arrange
      const mockTeacher = { id: 1, name: "John", surname: 'Doe', subjects_history: [{subject_id: 1}] };
      const mockSubjectHistory = { id: 1, name: "Math"};
      (teacherRepository.getTeacherById as jest.Mock).mockResolvedValue(mockTeacher);
      (getSubjectById as jest.Mock).mockResolvedValue(mockSubjectHistory);
      const mockTeacherResponseDto =  { id: 1, name: "John", surname: 'Doe', subjects_history: [{subject_id: 1, subject: mockSubjectHistory}] };
  
      // Act
      const result = await getTeacherById(1, true);
  
      // Assert
      expect(teacherRepository.getTeacherById).toHaveBeenCalledWith(1);
      expect(getSubjectById).toHaveBeenCalledWith(mockTeacher.subjects_history[0].subject_id);
      expect(removeUndefinedAndEmptyArrays(result)).toEqual(mockTeacherResponseDto);
    });
  

    it('should throw a ResourceNotFound error if teacher is not found', async () => {
      (teacherRepository.getTeacherById as jest.Mock).mockResolvedValue(null);

      await expect(getTeacherById(1)).rejects.toThrow(ResourceNotFound);
      expect(teacherRepository.getTeacherById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to fetch teacher');

      (teacherRepository.getTeacherById as jest.Mock).mockRejectedValue(mockError);

      await expect(getTeacherById(1)).rejects.toThrow('Failed to fetch teacher');
      expect(teacherRepository.getTeacherById).toHaveBeenCalledWith(1);
    });
  });

  describe('getAllTeachersNames', () => {
    it('should return all teachers names', async () => {
      const teachers = [{ id: 1, name: 'John', surname: 'Doe' }, { id: 1, name: 'Jane', surname: 'Smith' }];
      (teacherRepository.getAllTeachersNames as jest.Mock).mockResolvedValue(teachers);
  
      const result = await getAllTeachersNames();
  
      expect(result).toEqual(teachers);
      expect(teacherRepository.getAllTeachersNames).toHaveBeenCalled();
    });
  });

  // Test for getBenefits function
  describe('getBenefits', () => {
    it('should retrieve all benefits', async () => {
      const mockBenefits = [{ id: 1, name: 'Health Insurance' }, { id: 2, name: 'Pension Plan' }];

      (Benefit.findAll as jest.Mock).mockResolvedValue(mockBenefits);

      const result = await getBenefits();

      expect(Benefit.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockBenefits);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to fetch benefits');

      (Benefit.findAll as jest.Mock).mockRejectedValue(mockError);

      await expect(getBenefits()).rejects.toThrow('Failed to fetch benefits');
      expect(Benefit.findAll).toHaveBeenCalled();
    });
  });

  // Test for getCategories function
  describe('getCategories', () => {
    it('should retrieve all categories', async () => {
      const mockCategories = [{ id: 1, name: 'Science' }, { id: 2, name: 'Arts' }];

      (Category.findAll as jest.Mock).mockResolvedValue(mockCategories);

      const result = await getCategories();

      expect(Category.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });

    it('should throw an error if repository fails', async () => {
      const mockError = new Error('Failed to fetch categories');

      (Category.findAll as jest.Mock).mockRejectedValue(mockError);

      await expect(getCategories()).rejects.toThrow('Failed to fetch categories');
      expect(Category.findAll).toHaveBeenCalled();
    });
  });
});
