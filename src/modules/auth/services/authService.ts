import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmployeeNumber } from '../../userManagement';
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function login(employee_number: number, password: string) {
  const user = await getUserByEmployeeNumber(employee_number);
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  if (!user.is_active) {
    throw new Error('Usuario inactivo');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Credenciales inválidas');
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role_id,
      teacher_employee_number: user.teacher_employee_number,
    },
    SECRET_KEY,
    {
      expiresIn: '24h', // Expira en 1 hora
    }
  );

  return { token, user };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}
