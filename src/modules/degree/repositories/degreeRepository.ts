import Degree from "./models/Degree";

class Degreeepository {
    async addDegree(name: string, acronym: string) {
        return await Degree.create({ name, acronym });
    }

    async getDegrees() {
        return await Degree.findAll();
    }

    async getDegreeById(id: number)
    {
        return await Degree.findByPk(id);
    }
}

export default new Degreeepository();