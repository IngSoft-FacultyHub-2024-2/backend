import { Order } from 'sequelize';
import Event from './models/Event';

class EventRepository {
  async addEvent(event: Partial<Event>) {
    return await Event.create(event);
  }

  async getEvents(
    filters?: Partial<Event>,
    sortField?: string,
    sortOrder: 'ASC' | 'DESC' | undefined = 'ASC',
    page: number = 1,
    pageSize: number = 10
  ) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const orderOption = sortField
      ? ([[sortField, sortOrder]] as Order)
      : undefined;

    return await Event.findAll({
      where: filters,
      order: orderOption,
      limit,
      offset,
    });
  }

  async getEventById(id: number) {
    return await Event.findByPk(id);
  }

  async updateEvent(id: number, event: Partial<Event>) {
    return await Event.update(event, {
      where: { id },
    });
  }

  async deleteEvent(id: number) {
    return await Event.destroy({
      where: { id },
    });
  }
}

export default new EventRepository();
