import Need from '../repositories/models/Need';
import needRepository from '../repositories/needRepository';

export async function addNeed(event: Partial<Need>) {
  return await needRepository.addNeed(event);
}

export async function getNeeds(
  filters?: Partial<Need>,
  search?: string,
  sortField?: string,
  sortOrder?: 'ASC' | 'DESC'
) {
  return await needRepository.getNeeds(filters, search, sortField, sortOrder);
}

export async function getNeedById(id: number) {
  return await needRepository.getNeedById(id);
}

export async function updateNeed(id: number, event: Partial<Need>) {
  return await needRepository.updateNeed(id, event);
}

export async function deleteNeed(id: number) {
  return await needRepository.deleteNeed(id);
}
