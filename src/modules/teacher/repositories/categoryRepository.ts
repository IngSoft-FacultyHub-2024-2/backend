import Category from './models/Category';

class CategoryRepository {
  async getAllCategories() {
    return await Category.findAll();
  }

  async addCategory(category: Partial<Category>) {
    return await Category.create(category);
  }

  async updateCategory(id: number, category: Partial<Category>) {
    return await Category.update(category, {
      where: { id },
    });
  }

  async deleteCategory(id: number) {
    return await Category.destroy({
      where: { id },
    });
  }
}

export default new CategoryRepository();
