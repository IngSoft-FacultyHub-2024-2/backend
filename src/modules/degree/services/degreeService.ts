import degreeRepository from '../repositories/degreeRepository';

export async function addDegree(name: string, acronym: string) {
  return await degreeRepository.addDegree(name, acronym);
}

export async function getDegrees() {
  return await degreeRepository.getDegrees();
}

export async function getDegreeById(id: number) {
  return await degreeRepository.getDegreeById(id);
}

export async function getDegreeByAcronym(acronym: string) {
  return await degreeRepository.getDegreeByAcronym(acronym);
}

export async function updateDegree(id: number, name: string, acronym: string) {
  return await degreeRepository.updateDegree(id, name, acronym);
}

export async function deleteDegree(id: number) {
  return await degreeRepository.deleteDegree(id);
}
