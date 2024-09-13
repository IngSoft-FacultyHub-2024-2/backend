import Teacher from "../repositories/models/Teacher";
import teacherRepository from "../repositories/teacherRepository";
import { ResourceNotFound } from "../../../shared/utils/exceptions/customExceptions";
import Benefit from "../repositories/models/Benefit";
import Category from "../repositories/models/Category";

export async function addTeacher(teacher: Partial<Teacher>) {
  return await teacherRepository.addTeacher(teacher)
}

export async function getTeachers(
  search: string | undefined,
  sortField?: string,
  sortOrder?: 'ASC' | 'DESC',
  page: number = 1,
  pageSize: number = 10
) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const teacherRows = await teacherRepository.getTeachers(sortOrder, limit, offset, sortField);

  const totalPages = Math.ceil(teacherRows.count / pageSize);
  const teachers = teacherRows.rows;

  return { teachers, totalPages, currentPage: page };
}

export async function getTeacherById(id: number) {
  let teacher = await teacherRepository.getTeacherById(id)
  if (!teacher) {
    throw new ResourceNotFound(`Teacher with ID ${id} not found`);
  }
  return teacher
}

export async function getBenefits() {
  return await Benefit.findAll();
}

export async function getCategories() {
  return await Category.findAll();
}