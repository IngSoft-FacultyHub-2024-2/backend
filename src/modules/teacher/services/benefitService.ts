import benefitsRepository from '../repositories/benefitsRepository';
import Benefit from '../repositories/models/Benefit';

export async function getBenefits() {
  return await benefitsRepository.getAllBenefits();
}

export async function addBenefit(benefit: Partial<Benefit>) {
  return await benefitsRepository.addBenefit(benefit);
}

export async function updateBenefit(id: number, benefit: Partial<Benefit>) {
  return await benefitsRepository.updateBenefit(id, benefit);
}

export async function deleteBenefit(id: number) {
  return await benefitsRepository.deleteBenefit(id);
}
