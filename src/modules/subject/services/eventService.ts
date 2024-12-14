import eventRepository from '../repositories/eventRepository';
import Event from '../repositories/models/Event';

export async function addEvent(event: Partial<Event>) {
  return await eventRepository.addEvent(event);
}

export async function getEvents(
  filters?: Partial<Event>,
  sortField?: string,
  sortOrder?: 'ASC' | 'DESC',
  page?: number,
  pageSize?: number
) {
  return await eventRepository.getEvents(
    filters,
    sortField,
    sortOrder,
    page,
    pageSize
  );
}

export async function getEventById(id: number) {
  return await eventRepository.getEventById(id);
}

export async function updateEvent(id: number, event: Partial<Event>) {
  return await eventRepository.updateEvent(id, event);
}

export async function deleteEvent(id: number) {
  return await eventRepository.deleteEvent(id);
}
