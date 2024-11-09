// tests/semesterService.test.ts

import { getDegreeById } from '../../src/modules/degree';
import semesterRepository from '../../src/modules/semester/repositories/semesterRepository';
import * as semesterService from '../../src/modules/semester/services/semesterService';
import { getSubjectById } from '../../src/modules/subject';
import { getTeacherById } from '../../src/modules/teacher';
import { ResourceNotFound } from '../../src/shared/utils/exceptions/customExceptions';

jest.mock('../../src/modules/semester/repositories/semesterRepository');
jest.mock('../../src/modules/degree');
jest.mock('../../src/modules/subject');
jest.mock('../../src/modules/teacher');

describe('Semester Service', () => {
  const mockSemester = { id: 1, name: 'Spring 2024' };
  const mockLecture = {
    id: 1,
    subject_id: 1,
    lecture_groups: [],
    lecture_roles: [],
  };
  const mockDegree = { id: 1, name: 'Computer Science', acronym: 'CS' };
  const mockSubject = { id: 1, name: 'Software Engineering' };
  const mockTeacher = { id: 1, name: 'Dr. Smith' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addSemester', () => {
    it('should call semesterRepository.addSemester with the correct parameters', async () => {
      (semesterRepository.addSemster as jest.Mock).mockResolvedValue(
        mockSemester
      );

      const result = await semesterService.addSemester(mockSemester);

      expect(semesterRepository.addSemster).toHaveBeenCalledWith(mockSemester);
      expect(result).toEqual(mockSemester);
    });
  });

  describe('getSemesters', () => {
    it('should call semesterRepository.getSemesters and return all semesters', async () => {
      (semesterRepository.getSemesters as jest.Mock).mockResolvedValue([
        mockSemester,
      ]);

      const result = await semesterService.getSemesters();

      expect(semesterRepository.getSemesters).toHaveBeenCalled();
      expect(result).toEqual([mockSemester]);
    });
  });

  describe('getSemesterLectures', () => {
    it('should throw ResourceNotFound if degree does not exist', async () => {
      (getDegreeById as jest.Mock).mockResolvedValue(null);

      await expect(semesterService.getSemesterLectures(1, 999)).rejects.toThrow(
        ResourceNotFound
      );

      expect(getDegreeById).toHaveBeenCalledWith(999);
    });

    it('should throw ResourceNotFound if subject does not exist', async () => {
      (getDegreeById as jest.Mock).mockResolvedValue(mockDegree);
      (getSubjectById as jest.Mock).mockResolvedValue(null);

      await expect(
        semesterService.getSemesterLectures(1, 1, 999)
      ).rejects.toThrow(ResourceNotFound);

      expect(getSubjectById).toHaveBeenCalledWith(999);
    });

    it('should throw ResourceNotFound if semester lectures are not found', async () => {
      (getDegreeById as jest.Mock).mockResolvedValue(mockDegree);
      (getSubjectById as jest.Mock).mockResolvedValue(mockSubject);
      (semesterRepository.getSemesterLectures as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        semesterService.getSemesterLectures(1, 1, 1)
      ).rejects.toThrow(ResourceNotFound);

      expect(semesterRepository.getSemesterLectures).toHaveBeenCalledWith(
        1,
        1,
        1,
        undefined
      );
    });

    it('should process lecture data correctly if all data exists', async () => {
      (getDegreeById as jest.Mock).mockResolvedValue(mockDegree);
      (getSubjectById as jest.Mock).mockResolvedValue(mockSubject);
      (getTeacherById as jest.Mock).mockResolvedValue(mockTeacher);
      (semesterRepository.getSemesterLectures as jest.Mock).mockResolvedValue({
        id: 1,
        lectures: [mockLecture],
      });

      const result = await semesterService.getSemesterLectures(1);

      expect(semesterRepository.getSemesterLectures).toHaveBeenCalledWith(
        1,
        undefined,
        undefined,
        undefined
      );
      expect(result).toBeInstanceOf(Array); // Verifica que el resultado sea un array de objetos LectureResponseDto
    });
  });

  describe('addLecture', () => {
    it('should call semesterRepository.addLecture with the correct parameters', async () => {
      (semesterRepository.addLecture as jest.Mock).mockResolvedValue(
        mockLecture
      );

      const result = await semesterService.addLecture(mockLecture);

      expect(semesterRepository.addLecture).toHaveBeenCalledWith(mockLecture);
      expect(result).toEqual(mockLecture);
    });
  });
});
