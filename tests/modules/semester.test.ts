// tests/semesterService.test.ts

import { getDegreeById } from '../../src/modules/degree';
import {
  addLecture,
  addSemester,
  deleteLecture,
  getSemesterLectures,
  getSemesterLecturesGroups,
  getSemesters,
  submitTeacherReview,
  updateLecture,
} from '../../src/modules/semester';
import semesterRepository from '../../src/modules/semester/repositories/semesterRepository';
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
    dataValues: { id: 1, subject_id: 1 },
    id: 1,
    subject_id: 1,
    lecture_groups: [],
    lecture_roles: [],
  };
  const mockDegree = { id: 1, name: 'Computer Science', acronym: 'CS' };
  const mockSubject = {
    id: 1,
    name: 'Software Engineering',
    study_plan: {
      id: 1,
      year: 2024,
    },
  };
  const mockTeacher = { id: 1, name: 'Dr. Smith' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addSemester', () => {
    it('should call semesterRepository.addSemester with the correct parameters', async () => {
      (semesterRepository.addSemster as jest.Mock).mockResolvedValue(
        mockSemester
      );

      const result = await addSemester(mockSemester);

      expect(semesterRepository.addSemster).toHaveBeenCalledWith(mockSemester);
      expect(result).toEqual(mockSemester);
    });
  });

  describe('getSemesters', () => {
    it('should call semesterRepository.getSemesters and return all semesters', async () => {
      (semesterRepository.getSemesters as jest.Mock).mockResolvedValue([
        mockSemester,
      ]);

      const result = await getSemesters();

      expect(semesterRepository.getSemesters).toHaveBeenCalled();
      expect(result).toEqual([mockSemester]);
    });
  });

  describe('getSemesterLectures', () => {
    it('should throw ResourceNotFound if degree does not exist', async () => {
      (getDegreeById as jest.Mock).mockResolvedValue(null);

      await expect(getSemesterLectures(1, 999)).rejects.toThrow(
        ResourceNotFound
      );

      expect(getDegreeById).toHaveBeenCalledWith(999);
    });

    it('should throw ResourceNotFound if subject does not exist', async () => {
      (getDegreeById as jest.Mock).mockResolvedValue(mockDegree);
      (getSubjectById as jest.Mock).mockResolvedValue(null);

      await expect(getSemesterLectures(1, 1, 999)).rejects.toThrow(
        ResourceNotFound
      );

      expect(getSubjectById).toHaveBeenCalledWith(999);
    });

    it('should throw ResourceNotFound if semester lectures are not found', async () => {
      (getDegreeById as jest.Mock).mockResolvedValue(mockDegree);
      (getSubjectById as jest.Mock).mockResolvedValue(mockSubject);
      (semesterRepository.getSemesterLectures as jest.Mock).mockResolvedValue(
        null
      );

      await expect(getSemesterLectures(1, 1, 1)).rejects.toThrow(
        ResourceNotFound
      );

      expect(semesterRepository.getSemesterLectures).toHaveBeenCalledWith(
        1,
        1,
        1,
        undefined,
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

      const result = await getSemesterLectures(1);

      expect(semesterRepository.getSemesterLectures).toHaveBeenCalledWith(
        1,
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('addLecture', () => {
    it('should call semesterRepository.addLecture with the correct parameters', async () => {
      (semesterRepository.addLecture as jest.Mock).mockResolvedValue(
        mockLecture
      );

      const result = await addLecture(mockLecture);

      expect(semesterRepository.addLecture).toHaveBeenCalledWith(
        mockLecture,
        true
      );
      expect(result).toEqual(mockLecture);
    });
  });

  describe('getSemesterLecturesGroups', () => {
    const mockSemesterId = 1;
    const mockDegreeId = 2;
    const mockLectureGroups = [
      { id: 1, group: 'M5A' },
      { id: 2, group: 'M5B' },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return lecture groups when degreeId is provided and valid', async () => {
      (getDegreeById as jest.Mock).mockResolvedValue(true);
      (
        semesterRepository.getSemesterLecturesGroups as jest.Mock
      ).mockResolvedValue(mockLectureGroups);

      const result = await getSemesterLecturesGroups(
        mockSemesterId,
        mockDegreeId
      );

      expect(getDegreeById).toHaveBeenCalledWith(mockDegreeId);
      expect(semesterRepository.getSemesterLecturesGroups).toHaveBeenCalledWith(
        mockSemesterId,
        mockDegreeId
      );
      expect(result).toEqual(mockLectureGroups);
    });

    it('should return lecture groups when degreeId is not provided', async () => {
      (
        semesterRepository.getSemesterLecturesGroups as jest.Mock
      ).mockResolvedValue(mockLectureGroups);

      const result = await getSemesterLecturesGroups(mockSemesterId);

      expect(getDegreeById).not.toHaveBeenCalled();
      expect(semesterRepository.getSemesterLecturesGroups).toHaveBeenCalledWith(
        mockSemesterId,
        undefined
      );
      expect(result).toEqual(mockLectureGroups);
    });

    it('should throw ResourceNotFound error when degreeId is invalid', async () => {
      (getDegreeById as jest.Mock).mockResolvedValue(false);

      await expect(
        getSemesterLecturesGroups(mockSemesterId, mockDegreeId)
      ).rejects.toThrow(
        new ResourceNotFound('No se encontró la carrera por la que se filtró')
      );

      expect(getDegreeById).toHaveBeenCalledWith(mockDegreeId);
      expect(
        semesterRepository.getSemesterLecturesGroups
      ).not.toHaveBeenCalled();
    });
  });

  describe('updateLecture', () => {
    const mockLectureId = 1;
    const mockLectureData = {
      dataValues: { id: 1, subject_id: 1 },
      subjectId: 1,
    };
    const mockUpdatedLecture = {
      id: 1,
      dataValues: { id: 1, subject_id: 1 },
      subjectId: 1,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call semesterRepository.updateLecture with the correct parameters', async () => {
      (semesterRepository.updateLecture as jest.Mock).mockResolvedValue(
        mockUpdatedLecture
      );

      const result = await updateLecture(mockLectureId, mockLectureData);

      expect(semesterRepository.updateLecture).toHaveBeenCalledWith(
        mockLectureId,
        mockLectureData,
        []
      );
      expect(result).toEqual(mockUpdatedLecture);
    });

    it('should handle errors and propagate them', async () => {
      const mockError = new Error('Update failed');
      (semesterRepository.updateLecture as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(
        updateLecture(mockLectureId, mockLectureData)
      ).rejects.toThrow(mockError);

      expect(semesterRepository.updateLecture).toHaveBeenCalledWith(
        mockLectureId,
        mockLectureData,
        []
      );
    });
  });

  describe('deleteLecture', () => {
    const mockLectureId = 1;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call semesterRepository.deleteLecture with the correct parameters', async () => {
      (semesterRepository.deleteLecture as jest.Mock).mockResolvedValue(true);

      const result = await deleteLecture(mockLectureId);

      expect(semesterRepository.deleteLecture).toHaveBeenCalledWith(
        mockLectureId
      );
      expect(result).toBe(true);
    });

    it('should handle errors and propagate them', async () => {
      const mockError = new Error('Delete failed');
      (semesterRepository.deleteLecture as jest.Mock).mockRejectedValue(
        mockError
      );

      await expect(deleteLecture(mockLectureId)).rejects.toThrow(mockError);

      expect(semesterRepository.deleteLecture).toHaveBeenCalledWith(
        mockLectureId
      );
    });
  });

  describe('submitTeacherReview', () => {
    const mockLectureId = 1;
    const mockTeacherId = 2;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('debería aprobar la revisión cuando el profesor existe', async () => {
      (getTeacherById as jest.Mock).mockResolvedValue({ id: mockTeacherId });
      (semesterRepository.submitTeacherReview as jest.Mock).mockResolvedValue({
        lectureId: mockLectureId,
        teacherId: mockTeacherId,
        reviewData: 'approved',
      });

      const result = await submitTeacherReview(
        mockLectureId,
        mockTeacherId,
        true,
        null
      );

      expect(result).toEqual({
        lectureId: mockLectureId,
        teacherId: mockTeacherId,
        reviewData: 'approved',
      });
      expect(getTeacherById).toHaveBeenCalledWith(mockTeacherId);
      expect(semesterRepository.submitTeacherReview).toHaveBeenCalledWith(
        mockLectureId,
        mockTeacherId,
        'approved'
      );
    });

    it('debería rechazar la revisión cuando el profesor existe y proporciona una razón', async () => {
      const rejectionReason = 'Falta de información';
      (getTeacherById as jest.Mock).mockResolvedValue({ id: mockTeacherId });
      (semesterRepository.submitTeacherReview as jest.Mock).mockResolvedValue({
        lectureId: mockLectureId,
        teacherId: mockTeacherId,
        reviewData: rejectionReason,
      });

      const result = await submitTeacherReview(
        mockLectureId,
        mockTeacherId,
        false,
        rejectionReason
      );

      expect(result).toEqual({
        lectureId: mockLectureId,
        teacherId: mockTeacherId,
        reviewData: rejectionReason,
      });
      expect(getTeacherById).toHaveBeenCalledWith(mockTeacherId);
      expect(semesterRepository.submitTeacherReview).toHaveBeenCalledWith(
        mockLectureId,
        mockTeacherId,
        rejectionReason
      );
    });

    it('debería lanzar un error si el profesor no existe', async () => {
      (getTeacherById as jest.Mock).mockResolvedValue(null);

      await expect(
        submitTeacherReview(mockLectureId, mockTeacherId, true, null)
      ).rejects.toThrow(ResourceNotFound);

      expect(getTeacherById).toHaveBeenCalledWith(mockTeacherId);
      expect(semesterRepository.submitTeacherReview).not.toHaveBeenCalled();
    });

    it('debería lanzar un error si `semesterRepository.submitTeacherReview` falla', async () => {
      (getTeacherById as jest.Mock).mockResolvedValue({ id: mockTeacherId });
      (semesterRepository.submitTeacherReview as jest.Mock).mockRejectedValue(
        new Error('DB Error')
      );

      await expect(
        submitTeacherReview(mockLectureId, mockTeacherId, true, null)
      ).rejects.toThrow('DB Error');

      expect(getTeacherById).toHaveBeenCalledWith(mockTeacherId);
      expect(semesterRepository.submitTeacherReview).toHaveBeenCalledWith(
        mockLectureId,
        mockTeacherId,
        'approved'
      );
    });
  });
});
