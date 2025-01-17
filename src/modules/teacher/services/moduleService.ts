import Module from '../repositories/models/Module';
import moduleRepository from '../repositories/moduleRepository';

export async function getModules() {
  const modules = await moduleRepository.getModules();
  return modules;
}

export async function addModule(module: Partial<Module>) {
  return await moduleRepository.addModule(module);
}

export async function updateModule(moduleId: number, module: Partial<Module>) {
  return await moduleRepository.updateModule(moduleId, module);
}
