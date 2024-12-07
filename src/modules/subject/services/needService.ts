import Need from '../repositories/models/Need';
import needRepository from '../repositories/needRepository';

export async function addNeed(need: Partial<Need>) {
  return await needRepository.addNeed(need);
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

export async function updateNeed(id: number, need: Partial<Need>) {
  return await needRepository.updateNeed(id, need);
}

export async function deleteNeed(id: number) {
  return await needRepository.deleteNeed(id);
}
