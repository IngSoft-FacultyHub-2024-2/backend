import Module from './models/Module';

class ModuleRepository {
  async getModules() {
    const modules = await Module.findAll({
      order: [['time', 'ASC']],
    });

    return modules;
  }

  async addModule(module: Partial<Module>) {
    return await Module.create(module);
  }

  async updateModule(moduleId: number, module: Partial<Module>) {
    return await Module.update(module, {
      where: {
        id: moduleId,
      },
    });
  }
}

export default new ModuleRepository();
