import bcrypt from 'bcrypt';
import { getTeacherById } from '../../teacher';
import User from '../repositories/models/User';
import userRepository from '../repositories/userRepository';

export async function createUser(user: Partial<User>) {
  const teacherExist = await getTeacherById(user.teacher_id!);
  if (!teacherExist) {
    throw new Error('El docente no existe');
  }

  const userExist = await userRepository.getUserByTeacherId(user.teacher_id!);
  if (userExist) {
    throw new Error('El usuario de este docente ya existe');
  }

  const hashedPassword = await bcrypt.hash(user.password!, 10);
  user.password = hashedPassword;
  console.log(user);

  return await userRepository.createUser(user);
}

export async function getUserById(id: number) {
  return await userRepository.getUserById(id);
}

export async function getUsers() {
  return await userRepository.getUsers();
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
