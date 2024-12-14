import Benefit from './models/Benefit';

class BenefitRepository {
  async getAllBenefits() {
    return await Benefit.findAll();
  }

  async addBenefit(benefit: Partial<Benefit>) {
    return await Benefit.create(benefit);
  }

  async updateBenefit(id: number, benefit: Partial<Benefit>) {
    return await Benefit.update(benefit, {
      where: { id },
    });
  }

  async deleteBenefit(id: number) {
    return await Benefit.destroy({
      where: { id },
    });
  }
}

export default new BenefitRepository();
