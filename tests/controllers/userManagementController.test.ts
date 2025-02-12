import { Request, Response } from 'express';
import userManagementController from '../../src/controllers/userManagmentController';
import inputUpdatePasswordSchema from '../../src/controllers/validationSchemas/userSchemas/inputUpdatePasswordSchema';
import inputUserSchema from '../../src/controllers/validationSchemas/userSchemas/inputUserSchema';
import {
  createUser,
  getRoles,
  getUserById,
  getUsers,
  updatePassword,
} from '../../src/modules/userManagement';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';

jest.mock('../../src/modules/userManagement');
jest.mock('../../src/shared/utils/exceptions/handleExceptions');
jest.mock(
  '../../src/controllers/validationSchemas/userSchemas/inputUpdatePasswordSchema'
);
jest.mock(
  '../../src/controllers/validationSchemas/userSchemas/inputUserSchema'
);

describe('UserManagementController', () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const mockReq = {
      body: { username: 'johndoe', password: 'password123', role: 'admin' },
    } as Request;

    it('should create a user successfully', async () => {
      (inputUserSchema.validate as jest.Mock).mockResolvedValue(mockReq.body);
      (createUser as jest.Mock).mockResolvedValue({ id: 1, ...mockReq.body });

      await userManagementController.createUser(mockReq, mockRes);

      expect(createUser).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ id: 1, ...mockReq.body });
    });

    it('should handle validation errors', async () => {
      const error = new Error('Validation failed');
      (inputUserSchema.validate as jest.Mock).mockRejectedValue(error);

      await userManagementController.createUser(mockReq, mockRes);

      expect(returnError).toHaveBeenCalledWith(mockRes, error);
    });

    it('should handle errors during user creation', async () => {
      const error = new Error('Database error');
      (inputUserSchema.validate as jest.Mock).mockResolvedValue(mockReq.body);
      (createUser as jest.Mock).mockRejectedValue(error);

      await userManagementController.createUser(mockReq, mockRes);

      expect(returnError).toHaveBeenCalledWith(mockRes, error);
    });
  });

  describe('getUsers', () => {
    const mockReq = { query: {} } as Request;

    it('should return a list of users', async () => {
      const mockUsers = [{ id: 1, username: 'johndoe', role: 'admin' }];
      (getUsers as jest.Mock).mockResolvedValue(mockUsers);

      await userManagementController.getUsers(mockReq, mockRes);

      expect(getUsers).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors when fetching users', async () => {
      const error = new Error('Database error');
      (getUsers as jest.Mock).mockRejectedValue(error);

      await userManagementController.getUsers(mockReq, mockRes);

      expect(returnError).toHaveBeenCalledWith(mockRes, error);
    });
  });

  describe('getUserById', () => {
    const mockReq = { params: { id: '1' } } as unknown as Request;

    it('should return user details', async () => {
      const mockUser = {
        teacher_employee_number: 1,
        username: 'johndoe',
        role: 'admin',
      };
      (getUserById as jest.Mock).mockResolvedValue(mockUser);

      await userManagementController.getUserById(mockReq, mockRes);

      expect(getUserById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors when fetching user by ID', async () => {
      const error = new Error('Database error');
      (getUserById as jest.Mock).mockRejectedValue(error);

      await userManagementController.getUserById(mockReq, mockRes);

      expect(returnError).toHaveBeenCalledWith(mockRes, error);
    });
  });

  describe('updatePassword', () => {
    const mockReq = {
      body: {
        teacher_employee_number: 1,
        old_password: 'oldpass',
        new_password: 'newpass123',
      },
    } as any;

    it('should update the password successfully', async () => {
      (inputUpdatePasswordSchema.validate as jest.Mock).mockResolvedValue(
        mockReq.body
      );
      (updatePassword as jest.Mock).mockResolvedValue(undefined);

      await userManagementController.updatePassword(mockReq, mockRes);

      expect(updatePassword).toHaveBeenCalledWith(
        1,
        mockReq.body.old_password,
        mockReq.body.new_password
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle validation errors', async () => {
      const error = new Error('Validation failed');
      (inputUpdatePasswordSchema.validate as jest.Mock).mockRejectedValue(
        error
      );

      await userManagementController.updatePassword(mockReq, mockRes);

      expect(returnError).toHaveBeenCalledWith(mockRes, error);
    });

    it('should handle errors during password update', async () => {
      const error = new Error('Database error');
      (inputUpdatePasswordSchema.validate as jest.Mock).mockResolvedValue(
        mockReq.body
      );
      (updatePassword as jest.Mock).mockRejectedValue(error);

      await userManagementController.updatePassword(mockReq, mockRes);

      expect(returnError).toHaveBeenCalledWith(mockRes, error);
    });
  });

  describe('getRoles', () => {
    const mockReq = {} as Request;

    it('should return a list of roles', async () => {
      const mockRoles = ['admin', 'user', 'moderator'];
      (getRoles as jest.Mock).mockResolvedValue(mockRoles);

      await userManagementController.getRoles(mockReq, mockRes);

      expect(getRoles).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockRoles);
    });

    it('should handle errors when fetching roles', async () => {
      const error = new Error('Database error');
      (getRoles as jest.Mock).mockRejectedValue(error);

      await userManagementController.getRoles(mockReq, mockRes);

      expect(returnError).toHaveBeenCalledWith(mockRes, error);
    });
  });
});
