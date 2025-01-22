import bcrypt from 'bcrypt';
import { getTeacherById } from '../../src/modules/teacher';
import userRepository from '../../src/modules/userManagement/repositories/userRepository';
import {
  createUser,
  getUserById,
  getUsers,
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
        teacherId: 1,
        password: 'hashedPassword',
      };

      (getTeacherById as jest.Mock).mockResolvedValue({ id: 1 });
      (userRepository.getUserByTeacherId as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (userRepository.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        ...mockUser,
      });

      const result = await createUser(mockUser);

      expect(result).toEqual({ id: 1, ...mockUser });
      expect(getTeacherById).toHaveBeenCalledWith(mockUser.teacherId);
      expect(userRepository.getUserByTeacherId).toHaveBeenCalledWith(
        mockUser.teacherId
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(userRepository.createUser).toHaveBeenCalledWith({
        ...mockUser,
        password: 'hashedPassword',
      });
    });

    it('debería lanzar un error si el docente no existe', async () => {
      (getTeacherById as jest.Mock).mockResolvedValue(null);

      await expect(
        createUser({ teacherId: 1, password: '123456' })
      ).rejects.toThrow('El docente no existe');
    });

    it('debería lanzar un error si el usuario ya existe', async () => {
      (getTeacherById as jest.Mock).mockResolvedValue({ id: 1 });
      (userRepository.getUserByTeacherId as jest.Mock).mockResolvedValue({
        id: 1,
      });

      await expect(
        createUser({ teacherId: 1, password: '123456' })
      ).rejects.toThrow('El usuario de este docente ya existe');
    });
  });

  describe('getUserById', () => {
    it('debería retornar un usuario si existe', async () => {
      (userRepository.getUserById as jest.Mock).mockResolvedValue({
        id: 1,
        teacherId: 1,
      });

      const result = await getUserById(1);
      expect(result).toEqual({ id: 1, teacherId: 1 });
      expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    });

    it('debería retornar null si el usuario no existe', async () => {
      (userRepository.getUserById as jest.Mock).mockResolvedValue(null);

      const result = await getUserById(1);
      expect(result).toBeNull();
    });
  });

  describe('getUsers', () => {
    it('debería retornar una lista de usuarios', async () => {
      const mockUsers = [{ id: 1 }, { id: 2 }];
      (userRepository.getUsers as jest.Mock).mockResolvedValue(mockUsers);

      const result = await getUsers();
      expect(result).toEqual(mockUsers);
      expect(userRepository.getUsers).toHaveBeenCalled();
    });
  });

  describe('updatePassword', () => {
    it('debería actualizar la contraseña si el usuario existe', async () => {
      (userRepository.getUserById as jest.Mock).mockResolvedValue({ id: 1 });
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (userRepository.updatePassword as jest.Mock).mockResolvedValue([1]);

      const result = await updatePassword(1, 'oldPassword', 'newPassword');
      expect(result).toEqual([1]);
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        1,
        'newHashedPassword'
      );
    });

    it('debería lanzar un error si el usuario no existe', async () => {
      (userRepository.getUserById as jest.Mock).mockResolvedValue(null);

      await expect(
        updatePassword(1, 'oldPassword', 'newPassword')
      ).rejects.toThrow('El usuario no existe');
    });

    it('debería lanzar un error si la contraseña antigua es incorrecta', async () => {
      (userRepository.getUserById as jest.Mock).mockResolvedValue({
        id: 1,
        password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        updatePassword(1, 'oldPassword', 'newPassword')
      ).rejects.toThrow('old password is incorrect');
    });
  });
});
