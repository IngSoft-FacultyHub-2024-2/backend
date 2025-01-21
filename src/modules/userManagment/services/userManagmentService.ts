import bcrypt from 'bcrypt';
import User from '../repositories/models/User';
import userRepository from '../repositories/userRepository';

export async function createUser(user: Partial<User>) {
  //exists teacherCode
  const userExists = await userRepository.getUserByTeacherCode(
    user.teacherCode!
  );

  const hashedPassword = await bcrypt.hash(user.password!, 10);
  user.password = hashedPassword;

  return await userRepository.createUser(user);
}
