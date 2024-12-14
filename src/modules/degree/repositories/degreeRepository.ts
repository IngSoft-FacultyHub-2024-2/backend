import Degree from './models/Degree';

class Degreeepository {
  async addDegree(name: string, acronym: string) {
    return await Degree.create({ name, acronym });
  }

  async getDegrees() {
    return await Degree.findAll();
  }

  async getDegreeById(id: number) {
    return await Degree.findByPk(id);
  }

  async getDegreeByAcronym(acronym: string) {
    return await Degree.findOne({ where: { acronym } });
  }

  async updateDegree(id: number, name: string, acronym: string) {
    return await Degree.update({ name, acronym }, { where: { id } });
  }

  async deleteDegree(id: number) {
    return await Degree.destroy({ where: { id } });
  }
}

export default new Degreeepository();
