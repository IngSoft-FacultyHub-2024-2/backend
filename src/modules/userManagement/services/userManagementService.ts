import bcrypt from 'bcrypt';
import { getTeacherById } from '../../teacher';
import User from '../repositories/models/User';
import userRepository from '../repositories/userRepository';

export async function createUser(user: Partial<User>) {
  const teacher = await getTeacherById(user.teacher_id!);
  if (!teacher) {
    throw new Error('El docente no existe');
  }

  const userExist = await userRepository.getUserByTeacherId(user.teacher_id!);
  if (userExist) {
    throw new Error('El usuario de este docente ya existe');
  }

  const hashedPassword = await bcrypt.hash(user.password!, 10);
  user.password = hashedPassword;
  user.teacher_employee_number = teacher.employee_number!;
  console.log(user);

  return await userRepository.createUser(user);
}

export async function getUserById(id: number) {
  return await userRepository.getUserById(id);
}

export async function getUsers(
  search?: string,
  role?: string,
  is_active?: string,
  page: number = 1
) {
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const users = await userRepository.getUsers(
    limit,
    offset,
    search,
    role,
    is_active
  );

  const totalPages = Math.ceil(users.count / pageSize);
  const currentPage = page;

  return { users: users.rows, totalPages, currentPage };
}

export async function updatePassword(
  id: number,
  oldPassword: string,
  newPassword: string
) {
  const user = await getUserById(id);
  if (!user) {
    throw new Error('El usuario no existe');
  }

  await comparePasswords(oldPassword, user.password);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await userRepository.updatePassword(id, hashedPassword);
}

async function comparePasswords(
  oldPassword: string,
  currentHashedPassword: string
) {
  const isPasswordValid = await bcrypt.compare(
    oldPassword,
    currentHashedPassword
  );
  if (!isPasswordValid) {
    throw new Error('old password is incorrect');
  }
}

export async function getUserByEmployeeNumber(employee_number: number) {
  return await userRepository.getUserByEmployeeNumber(employee_number);
}

//dar de baja a un usuario
export async function unsubscribeUser(id: number) {
  const user = await getUserById(id);
  if (!user) {
    throw new Error('El usuario no existe');
  }

  return await userRepository.unsubscribeUser(id);
}

export async function getRoles() {
  return await userRepository.getRoles();
}

export async function getUserByTeacherId(id: number) {
  return await userRepository.getUserByTeacherId(id);
}
