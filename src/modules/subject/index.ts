import { SubjectEventRequestDto } from './dtos/request/subjectEventRequestDto';
import { SubjectRequestDto } from './dtos/request/subjectRequestDto';
import { HourConfigResponseDto } from './dtos/response/hourConfigResponseDto';
import { NeedResponseDto } from './dtos/response/needResponseDto';
import { SubjectEventResponseDto } from './dtos/response/subjectEventResponseDto';
import { SubjectResponseDto } from './dtos/response/subjectResponseDto';
import { addEvent, getEvents } from './services/eventService';
import {
  addNeed,
  deleteNeed,
  getNeeds,
  updateNeed,
} from './services/needService';
import { addStudyPlan, getStudyPlans } from './services/studyPlanService';
import {
  addSubject,
  deleteSubject,
  getAllSubjectNames,
  getSubjectById,
  getSubjects,
  teacherCoordinatorSubjects,
  updateSubject,
} from './services/subjectService';

//Event
export { addEvent, getEvents, SubjectEventRequestDto, SubjectEventResponseDto };

//Need
export { addNeed, deleteNeed, getNeeds, NeedResponseDto, updateNeed };

//StudyPlan
export { addStudyPlan, getStudyPlans };

//Subject
export {
  addSubject,
  deleteSubject,
  getAllSubjectNames,
  getSubjectById,
  getSubjects,
  HourConfigResponseDto,
  SubjectRequestDto,
  SubjectResponseDto,
  teacherCoordinatorSubjects,
  updateSubject,
};
