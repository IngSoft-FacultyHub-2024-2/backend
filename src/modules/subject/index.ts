import { SubjectEventRequestDto } from './dtos/request/subjectEventRequestDto';
import { SubjectRequestDto } from './dtos/request/subjectRequestDto';
import { HourConfigResponseDto } from './dtos/response/hourConfigResponseDto';
import { NeedResponseDto } from './dtos/response/needResponseDto';
import { SubjectEventResponseDto } from './dtos/response/subjectEventResponseDto';
import { SubjectResponseDto } from './dtos/response/subjectResponseDto';
import {
  addEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from './services/eventService';
import {
  addNeed,
  deleteNeed,
  getNeedById,
  getNeeds,
  updateNeed,
} from './services/needService';
import {
  addStudyPlan,
  deleteStudyPlan,
  getStudyPlans,
  updateStudyPlan,
} from './services/studyPlanService';
import {
  addSubject,
  deleteSubject,
  getAllSubjectNames,
  getSubjectById,
  getSubjects,
  teacherCoordinatorSubjects,
  updateSubject,
  amountOfTeachersPerSubject,
} from './services/subjectService';

//Event
export {
  addEvent,
  deleteEvent,
  getEvents,
  SubjectEventRequestDto,
  SubjectEventResponseDto,
  updateEvent,
};

//Need
export {
  addNeed,
  deleteNeed,
  getNeedById,
  getNeeds,
  NeedResponseDto,
  updateNeed,
};

//StudyPlan
export { addStudyPlan, deleteStudyPlan, getStudyPlans, updateStudyPlan };

//Subject
export {
  addSubject,
  getSubjectById,
  getAllSubjectNames,
  teacherCoordinatorSubjects,
  SubjectRequestDto,
  getSubjects,
  SubjectResponseDto,
  HourConfigResponseDto,
  updateSubject,
  deleteSubject,
  amountOfTeachersPerSubject,
};
