import Event from "../repositories/models/Event";
import eventRepository from '../repositories/eventRepository';

export async function addEvent(event: Partial<Event>) {
    return await eventRepository.addEvent(event);
}

export async function getEvents(filters?: Partial<Event>) {
    return await eventRepository.getEvents(filters);
}
