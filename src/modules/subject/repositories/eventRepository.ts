import Event from "./models/Event";

class EventRepository {
  async addEvent(event: Partial<Event>) {
    return await Event.create(event);
  }

  async getEvents(filters?: Partial<Event>) {
    return await Event.findAll({ where: filters });
  }
}

export default new EventRepository();