import {
  addLecture,
  addSemester,
  getSemesterLectures,
  getSemesters,
  getSemesterLecturesGroups,
  updateLecture,
  getSemesterLecturesToAssign,
  setTeacherToLecture,
  deleteLecture,
  deleteTeachersAssignations,
} from './services/semesterService';

import { LectureRoleResponseDto } from './dtos/response/lectureResponseDto';

export {
  addLecture,
  addSemester,
  getSemesterLectures,
  getSemesters,
  getSemesterLecturesGroups,
  updateLecture,
  getSemesterLecturesToAssign,
  setTeacherToLecture,
  deleteLecture,
  deleteTeachersAssignations,
  LectureRoleResponseDto,
};
