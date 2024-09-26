import { Op, Order } from "sequelize";
import Need from "./models/Need";

class NeedRepository {
  async addNeed(need: Partial<Need>) {
    return await Need.create(need);
  }

  async getNeeds(filters?: Partial<Need>,  
    search?: string,
    sortField?: string, 
    sortOrder:'ASC' | 'DESC' | undefined = 'ASC', 
  ) {
    const orderOption = sortField ? [[sortField, sortOrder]] as Order : [['name', 'DESC']] as Order;
    
    const searchQuery = search
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

    const whereClause = {
        ...filters,
        ...searchQuery,
    };

    return await Need.findAll({ 
      where: whereClause, 
      order: orderOption,
    });
  }

  async getNeedById(id: number) {
    return await Need.findByPk(id);
  }
}

export default new NeedRepository();