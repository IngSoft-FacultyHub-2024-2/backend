import { Request, Response } from 'express';
import categoryController from '../../src/controllers/categoryController';
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../../src/modules/teacher';
import { returnError } from '../../src/shared/utils/exceptions/handleExceptions';

jest.mock('../../src/modules/teacher');
jest.mock('../../src/shared/utils/exceptions/handleExceptions');

describe('CategoryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategories', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
      req = { query: {} };
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      res = { status: statusMock, json: jsonMock };
      jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    });

    it('should return a list of categories', async () => {
      const mockCategories = [{ id: 1, name: 'Full-Time' }];
      // Asegúrate de que la función `getCategories` sea un mock.
      (getCategories as jest.Mock).mockResolvedValue(mockCategories);

      await categoryController.getCategories(req as Request, res as Response);

      // Verifica que la función mockeada `getCategories` fue llamada.
      expect(getCategories).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockCategories);
    });

    it('should handle errors when fetching categories fails', async () => {
      const error = new Error('Something went wrong');
      // Simula un error cuando se llama a `getCategories`.
      (getCategories as jest.Mock).mockRejectedValue(error);

      await categoryController.getCategories(req as Request, res as Response);

      expect(getCategories).toHaveBeenCalledTimes(1);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('addCategory', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
      req = { body: { name: 'Full-Time' } };
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      res = { status: statusMock, json: jsonMock };
      jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    });

    it('should add a category successfully', async () => {
      const mockCategory = { id: 1, name: 'Full-Time' };
      // Asegúrate de que la función `addCategory` sea un mock.
      (addCategory as jest.Mock).mockResolvedValue(mockCategory);

      await categoryController.addCategory(req as Request, res as Response);

      expect(addCategory).toHaveBeenCalledWith(req.body);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockCategory);
    });

    it('should handle errors when adding a category fails', async () => {
      const error = new Error('Something went wrong');
      // Simula un error cuando se llama a `addCategory`.
      (addCategory as jest.Mock).mockRejectedValue(error);

      await categoryController.addCategory(req as Request, res as Response);

      expect(addCategory).toHaveBeenCalledWith(req.body);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('updateCategory', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
      req = { params: { id: '1' }, body: { name: 'Part-Time' } };
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      res = { status: statusMock, json: jsonMock };
      jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    });

    it('should update a category successfully', async () => {
      const updatedCategory = { id: 1, name: 'Part-Time' };
      // Asegúrate de que la función `updateCategory` sea un mock.
      (updateCategory as jest.Mock).mockResolvedValue(updatedCategory);

      await categoryController.updateCategory(req as Request, res as Response);

      expect(updateCategory).toHaveBeenCalledWith(1, req.body);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedCategory);
    });

    it('should handle errors when updating a category fails', async () => {
      const error = new Error('Something went wrong');
      // Simula un error cuando se llama a `updateCategory`.
      (updateCategory as jest.Mock).mockRejectedValue(error);

      await categoryController.updateCategory(req as Request, res as Response);

      expect(updateCategory).toHaveBeenCalledWith(1, req.body);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('deleteCategory', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;

    beforeEach(() => {
      req = { params: { id: '1' } };
      statusMock = jest.fn().mockReturnThis();
      res = { status: statusMock };
      jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    });

    it('should delete a category successfully', async () => {
      // Asegúrate de que la función `deleteCategory` sea un mock.
      (deleteCategory as jest.Mock).mockResolvedValue(undefined);

      await categoryController.deleteCategory(req as Request, res as Response);

      expect(deleteCategory).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(204);
    });

    it('should handle errors when deleting a category fails', async () => {
      const error = new Error('Something went wrong');
      // Simula un error cuando se llama a `deleteCategory`.
      (deleteCategory as jest.Mock).mockRejectedValue(error);

      await categoryController.deleteCategory(req as Request, res as Response);

      expect(deleteCategory).toHaveBeenCalledWith(1);
      expect(returnError).toHaveBeenCalledWith(res, error);
    });
  });
});
