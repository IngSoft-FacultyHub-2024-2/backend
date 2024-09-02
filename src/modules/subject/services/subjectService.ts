import subjectRepository from '../repositories/subjectRepository';
import Subject from '../repositories/models/Subject';
import { SubjectRequestDto, SubjectRequestDtoHelper } from '../dtos/request/subjectRequestDto';
import { SubjectEventRequestDto, SubjectEventRequestDtoHelper } from '../dtos/request/subjectEventRequestDto';
import eventRepository from '../repositories/eventRepository';
import { ResourceNotFound } from '../../../shared/utils/exceptions/customExceptions';

export async function addSubject(subjectDto: SubjectRequestDto, events: SubjectEventRequestDto[]) {
  const subject: Partial<Subject> = SubjectRequestDtoHelper.toModel(subjectDto);
  const newSubject = await subjectRepository.addSubject(subject);
  if (!events) return newSubject;
  for (const event of events) {
    if (!await eventRepository.getEventById(event.eventId)) {
      throw new ResourceNotFound('eventId invalid, that event does not exist');
    }
    await subjectRepository.addEventToSubject(newSubject.id, event.eventId, event.description);
  }
  return newSubject;
}

