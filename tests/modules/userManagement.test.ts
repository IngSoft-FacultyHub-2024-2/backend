import bcrypt from 'bcrypt';
import { getTeacherById } from '../../src/modules/teacher';
import userRepository from '../../src/modules/userManagement/repositories/userRepository';
import {
  createUser,
  getRoles,
  getUserByEmployeeNumber,
  getUserByTeacherId,
  unsubscribeUser,
  updatePassword,
} from '../../src/modules/userManagement/services/userManagementService';

jest.mock('../../src/modules/userManagement/repositories/userRepository');
jest.mock('bcrypt');
jest.mock('../../src/modules/teacher', () => ({
  getTeacherById: jest.fn(),
}));

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('debería crear un usuario si el docente existe y no tiene usuario asociado', async () => {
      const mockUser = {
        teacher_id: 1,
        password: 'password123',
      };

      const mockTeacher = { id: 1, employee_number: 'EMP001' };

      (getTeacherById as jest.Mock).mockResolvedValue(mockTeacher);
      (userRepository.getUserByTeacherId as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (userRepository.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        ...mockUser,
        password: 'hashedPassword',
        teacher_employee_number: mockTeacher.employee_number,
      });

      const result = await createUser(mockUser);

      expect(result).toEqual({
        id: 1,
        ...mockUser,
        password: 'hashedPassword',
        teacher_employee_number: mockTeacher.employee_number,
      });
      expect(getTeacherById).toHaveBeenCalledWith(mockUser.teacher_id);
      expect(userRepository.getUserByTeacherId).toHaveBeenCalledWith(
        mockUser.teacher_id
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepository.createUser).toHaveBeenCalledWith({
        ...mockUser,
        password: 'hashedPassword',
        teacher_employee_number: mockTeacher.employee_number,
      });
    });

    it('debería lanzar un error si el docente no existe', async () => {
      (getTeacherById as jest.Mock).mockResolvedValue(null);

      await expect(
        createUser({ teacher_id: 1, password: '123456' })
      ).rejects.toThrow('El docente no existe');
    });

    it('debería lanzar un error si el usuario ya existe', async () => {
      (getTeacherById as jest.Mock).mockResolvedValue({ id: 1 });
      (userRepository.getUserByTeacherId as jest.Mock).mockResolvedValue({
        id: 1,
      });

      await expect(
        createUser({ teacher_id: 1, password: '123456' })
      ).rejects.toThrow('El usuario de este docente ya existe');
    });
  });

  describe('updatePassword', () => {
    it('debería actualizar la contraseña si el usuario existe', async () => {
      (userRepository.getUserById as jest.Mock).mockResolvedValue({
        id: 1,
        password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      (userRepository.updatePassword as jest.Mock).mockResolvedValue([1]);
      (userRepository.getUserByEmployeeNumber as jest.Mock).mockResolvedValue({
        id: 1,
        teacher_employee_number: 'EMP001',
        password: 'hashedPassword',
      });

      const result = await updatePassword(1, 'oldPassword', 'newPassword');

      expect(result).toEqual([1]);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'oldPassword',
        'hashedPassword'
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        1,
        'newHashedPassword'
      );
    });

    it('debería lanzar un error si la contraseña antigua es incorrecta', async () => {
      (userRepository.getUserByEmployeeNumber as jest.Mock).mockResolvedValue({
        id: 1,
        password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        updatePassword(1, 'wrongOldPassword', 'newPassword')
      ).rejects.toThrow('La contraseña ingresada no coincide con la actual');
    });
  });

  describe('unsubscribeUser', () => {
    it('debería dar de baja a un usuario existente', async () => {
      (userRepository.getUserById as jest.Mock).mockResolvedValue({ id: 1 });
      (userRepository.unsubscribeUser as jest.Mock).mockResolvedValue(true);

      const result = await unsubscribeUser(1);
      expect(result).toBe(true);
      expect(userRepository.unsubscribeUser).toHaveBeenCalledWith(1);
    });

    it('debería lanzar un error si el usuario no existe', async () => {
      (userRepository.getUserById as jest.Mock).mockResolvedValue(null);

      await expect(unsubscribeUser(1)).rejects.toThrow('El usuario no existe');
    });
  });

  describe('getRoles', () => {
    it('debería retornar los roles de usuario', async () => {
      const mockRoles = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' },
      ];
      (userRepository.getRoles as jest.Mock).mockResolvedValue(mockRoles);

      const result = await getRoles();
      expect(result).toEqual(mockRoles);
      expect(userRepository.getRoles).toHaveBeenCalled();
    });
  });

  describe('getUserByEmployeeNumber', () => {
    it('debería retornar un usuario si el número de empleado coincide', async () => {
      const mockUser = { id: 1, employee_number: 123 };
      (userRepository.getUserByEmployeeNumber as jest.Mock).mockResolvedValue(
        mockUser
      );

      const result = await getUserByEmployeeNumber(123);
      expect(result).toEqual(mockUser);
      expect(userRepository.getUserByEmployeeNumber).toHaveBeenCalledWith(123);
    });
  });

  describe('getUserByTeacherId', () => {
    it('debería retornar un usuario si el ID del docente coincide', async () => {
      const mockUser = { id: 1, teacher_id: 1 };
      (userRepository.getUserByTeacherId as jest.Mock).mockResolvedValue(
        mockUser
      );

      const result = await getUserByTeacherId(1);
      expect(result).toEqual(mockUser);
      expect(userRepository.getUserByTeacherId).toHaveBeenCalledWith(1);
    });
  });
});
