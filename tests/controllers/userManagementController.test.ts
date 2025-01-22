import express, { Application } from 'express';
import userManagementController from '../../src/controllers/userManagmentController';
import inputUserSchema from '../../src/controllers/validationSchemas/userSchemas/inputUserSchema';
import { createUser } from '../../src/modules/userManagement';

// Mock de los módulos usados
jest.mock('../modules/userManagement');
jest.mock('../shared/utils/exceptions/handleExceptions');
jest.mock(
  '../controllers/validationSchemas/userSchemas/inputUpdatePassworSchema'
);
jest.mock('../controllers/validationSchemas/userSchemas/inputUserSchema');

const app: Application = express();
app.use(express.json());

app.post('/users', (req, res) => userManagementController.createUser(req, res));
app.get('/users', (req, res) => userManagementController.getUsers(req, res));
app.get('/users/:id', (req, res) =>
  userManagementController.getUserById(req, res)
);
app.put('/users/:id/password', (req, res) =>
    userManagementController.updatePassword(req, res)
);

describe('User Management Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('debería crear un usuario y retornar 201', async () => {
      const mockUser = { teacherId: 1, password: '123456' };
      (inputUserSchema.validate as jest.Mock).mockResolvedValue(mockUser);
      (createUser as jest.Mock).mockResolvedValue({ id: 1, ...mockUser });

      const response = await request(app).post('/users').send(mockUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, ...mockUser });
      expect(inputUserSchema.validate).toHaveBeenCalledWith(mockUser);
      expect(createUser).toHaveBeenCalledWith(mockUser);
    });

    it('debería retornar error 400 si la validación falla', async () => {
      const validationError = new Error('Invalid input');
      (inputUserSchema.validate as jest.Mock).mockRejectedValue(
        validationError
      );

      const response = await request(app).post('/users').send({});

      expect(response.status).toBe(500);
      expect(returnError).toHaveBeenCalled();
    });
  });

  describe('getUsers', () => {
    it('debería retornar una lista de usuarios y status 200', async () => {
      const mockUsers = [{ id: 1 }, { id: 2 }];
      (getUsers as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(getUsers).toHaveBeenCalled();
    });

    it('debería manejar errores y llamar a returnError', async () => {
      const error = new Error('Database error');
      (getUsers as jest.Mock).mockRejectedValue(error);

      const response = await request(app).get('/users');

      expect(response.status).toBe(500);
      expect(returnError).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('debería retornar un usuario existente y status 200', async () => {
      const mockUser = { id: 1, teacherId: 1 };
      (getUserById as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(getUserById).toHaveBeenCalledWith(1);
    });

    it('debería manejar errores si el usuario no existe', async () => {
      (getUserById as jest.Mock).mockRejectedValue(new Error('User not found'));

      const response = await request(app).get('/users/99');

      expect(response.status).toBe(500);
      expect(returnError).toHaveBeenCalled();
    });
  });

  describe('updatePassword', () => {
    it('debería actualizar la contraseña y retornar 200', async () => {
      (inputUpdatePasswordSchema.validate as jest.Mock).mockResolvedValue({});
      (updatePassword as jest.Mock).mockResolvedValue();

      const response = await request(app)
        .put('/users/1/password')
        .send({ oldPassword: '123456', newPassword: '654321' });

      expect(response.status).toBe(200);
      expect(updatePassword).toHaveBeenCalledWith(1, '123456', '654321');
    });

    it('debería retornar error si la validación de contraseña falla', async () => {
      const validationError = new Error('Invalid password');
      (inputUpdatePasswordSchema.validate as jest.Mock).mockRejectedValue(
        validationError
      );

      const response = await request(app)
        .put('/users/1/password')
        .send({ oldPassword: '', newPassword: '654321' });

      expect(response.status).toBe(500);
      expect(returnError).toHaveBeenCalled();
    });
  });
});
