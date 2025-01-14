import {
  addLecture,
  addSemester,
  getSemesterLectures,
  getSemesters,
  getSemesterLecturesGroups,
  updateLecture,
  getSemesterLecturesToAssign,
  setTeacherToLecture,
  getPreassignedTeachers,
  deleteLecture,
  deleteTeachersAssignations,
} from './services/semesterService';

import {
  LectureRoleResponseDto,
  LectureResponseDto,
} from './dtos/response/lectureResponseDto';

export {
  addLecture,
  addSemester,
  getSemesterLectures,
  getSemesters,
  getSemesterLecturesGroups,
  updateLecture,
  getSemesterLecturesToAssign,
  setTeacherToLecture,
  getPreassignedTeachers,
  deleteLecture,
  deleteTeachersAssignations,
  LectureRoleResponseDto,
  LectureResponseDto,
};
