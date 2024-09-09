import Teacher from "../repositories/models/Teacher";
import teacherRepository from "../repositories/teacherRepository";
import { ResourceNotFound } from "../../../shared/utils/exceptions/customExceptions";

export async function addTeacher(teacher: Partial<Teacher>) {
  return await teacherRepository.addTeacher(teacher)
}

export async function getTeacherById(id: number) {
  let teacher = await teacherRepository.getTeacherById(id)
  if (!teacher) {
    throw new ResourceNotFound(`Teacher with ID ${id} not found`);
  }
  return teacher
}