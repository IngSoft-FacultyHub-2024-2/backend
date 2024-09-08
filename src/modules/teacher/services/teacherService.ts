import Teacher from "../repositories/models/Teacher";
import teacherRepository from "../repositories/teacherRepository";


export async function addTeacher(teacher: Partial<Teacher>) {
  return await teacherRepository.addTeacher(teacher)
}

