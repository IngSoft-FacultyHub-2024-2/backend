import categoryRepository from '../repositories/categoryRepository';
import Category from '../repositories/models/Category';

export async function getCategories() {
  return await categoryRepository.getAllCategories();
}

export async function addCategory(category: Partial<Category>) {
  return await categoryRepository.addCategory(category);
}

export async function updateCategory(id: number, category: Partial<Category>) {
  return await categoryRepository.updateCategory(id, category);
}

export async function deleteCategory(id: number) {
  return await categoryRepository.deleteCategory(id);
}
