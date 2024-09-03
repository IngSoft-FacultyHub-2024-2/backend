import Event from "../repositories/models/Event";
import eventRepository from '../repositories/eventRepository';

export async function addEvent(event: Partial<Event>) {
    return await eventRepository.addEvent(event);
}

export async function getEvents(filters?: Partial<Event>, sortField?: string, sortOrder?: 'ASC' | 'DESC', page?: number, pageSize?: number) {
    return await eventRepository.getEvents(filters, sortField, sortOrder, page, pageSize);
}

export async function getEventById(id: number) {
    return await eventRepository.getEventById(id);
}
